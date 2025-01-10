'use client'
import AdminHeader from '@/components/adminHeader'
import Button from '@/components/button'
import DashboardGrid from '@/components/dashboardGrid'
import PlusIcon from '@/components/icon/plusIcon'
import Input from '@/components/input'
import MediaListItem from '@/components/mediaListItem'
import MemberItem from '@/components/memberItem'
import UsageAlert from '@/components/usageAlert'
import Widget from '@/components/widget'
import { CREATE_ORDER } from '@/lib/queries/orders'
import { stripePromise } from '@/lib/stripe'
import { valueFormatter } from '@/lib/testData'
import { useDashboardStore } from '@/store'
import { useMutation } from '@apollo/client'
import { PieChart } from '@mui/x-charts/PieChart'
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { Appearance } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'

type CheckoutFormProps = {
  capsuleSize: string
  storageYears: number
  amount_sum: number
  capsule_price: number
  period: number
  isCapsuleNameError?: boolean
  capsuleNameRef?: React.RefObject<HTMLInputElement>
}

function CheckoutForm({
  capsuleSize,
  storageYears,
  amount_sum,
  capsule_price,
  period,
  isCapsuleNameError,
  capsuleNameRef,
}: CheckoutFormProps) {
  const { user } = useDashboardStore()
  const stripe = useStripe()
  const router = useRouter()
  const elements = useElements()
  const [createOrder] = useMutation(CREATE_ORDER)
  const [processing, setProcessing] = useState(false)
  const [stripeError, setStripeError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements || elements === null) return

    if (isCapsuleNameError && capsuleNameRef?.current) {
      capsuleNameRef.current.focus()
      return
    }

    setProcessing(true)

    const cardNumberElement = elements.getElement(CardNumberElement) // カード番号
    const cardExpiryElement = elements.getElement(CardExpiryElement) // 有効期限
    const cardCvcElement = elements.getElement(CardCvcElement) // CVC

    if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
      console.error('One or more elements not found.')
      return
    }

    const { token, error } = await stripe.createToken(cardNumberElement) // トークン作成

    if (error) {
      setStripeError(error.type)
      setProcessing(false)
      return
    }

    // GraphQLミューテーションの実行
    try {
      await createOrder({
        variables: {
          createOrderInput: {
            user_id: user?.id,
            capsule_size: capsuleSize,
            storage_years: storageYears,
            stripe_token: token.id,
          },
        },
      })
      router.refresh()
      alert('購入が完了しました。')
    } catch (err) {
      console.error(err)
    }

    setProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className=" flex flex-col gap-2">
      <div>
        <label>カード番号</label>
        <CardNumberElement
          className="border p-2"
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1F2937',
                '::placeholder': {
                  color: '#9CA3AF',
                },
              },
              invalid: {
                color: '#EF4444',
              },
            },
          }}
        />
      </div>
      <div className="w-full flex flex-row gap-4 mb-8">
        <div className="flex-1">
          <label>有効期限</label>
          <CardExpiryElement
            className="border p-2"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1F2937',
                  '::placeholder': {
                    color: '#9CA3AF',
                  },
                },
                invalid: {
                  color: '#EF4444',
                },
              },
            }}
          />
        </div>
        <div className="flex-1">
          <label>CVC</label>
          <CardCvcElement
            className="border p-2"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1F2937',
                  '::placeholder': {
                    color: '#9CA3AF',
                  },
                },
                invalid: {
                  color: '#EF4444',
                },
              },
            }}
          />
        </div>
      </div>
      <div className="flex flex-row gap-4 justify-end items-center">
        <div className="flex flex-col gap-0.5 items-end">
          <h3 className="font-bold text-2xl">
            ¥{amount_sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </h3>
          <span className="text-description text-sm">
            内訳: ¥
            {capsule_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
            (カプセル料金) + ¥
            {(period * 3000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
            (保管期間/{period}年)
          </span>
        </div>
        <Button
          type="submit"
          disabled={!stripe || processing}
          className="text-white p-4 rounded-lg"
        >
          {processing ? '処理中...' : '購入する'}
        </Button>
      </div>
      {stripeError === 'validation_error' && (
        <UsageAlert>支払い情報を入力してください。</UsageAlert>
      )}
    </form>
  )
}

export default function ADMIN() {
  const {
    user,
    members,
    MediaData,
    selectedClassId,
    capsulesByClass,
    setInit,
  } = useDashboardStore()
  const router = useRouter()
  // ロールの確認が終了するまでダッシュボードを表示しないためのstate
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!user) {
      try {
        setInit()
      } catch {
        router.push('/')
      }
    }
    if (user?.role === 'MEMBER' || user?.role === 'LEADER') {
      router.push('/dashboard')
    } else {
      setLoading(false)
    }
  }, [user, router, setInit]) // userまたはrouterが変わったときにのみ実行

  const [capsuleSize, setCapsuleSize] = useState<'SMALL' | 'MEDIUM' | 'LARGE'>(
    'MEDIUM',
  )
  const [storageYears, setStorageYears] = useState<number>(7)
  const [selectedCapsuleIndex, setSelectedCapsuleIndex] = useState<number>(0)
  const [capsuleName, setCapsuleName] = useState<string>('')
  const [showCreateCapsuleDialog, setShowCreateCapsuleDialog] =
    useState<boolean>(false)
  const [isCapsuleNameError, setIsCapsuleNameError] = useState<boolean>(false)
  const capsuleNameRef = useRef<HTMLInputElement>(null)
  const layout = [
    { i: '1', x: 0, y: 0, w: 7, h: 10 },
    { i: '2', x: 8, y: 0, w: 3, h: 9 },
  ]

  type CapsuleSize = 'SMALL' | 'MEDIUM' | 'LARGE'
  const roleOrder = { ADMIN: 1, LEADER: 2, MEMBER: 3 }
  const sortedMembers = [...members].sort(
    (a, b) => roleOrder[a.role] - roleOrder[b.role],
  )

  const onLeftChevronClick = () => {
    if (
      capsulesByClass[selectedClassId][selectedCapsuleIndex] &&
      capsulesByClass[selectedClassId].length > 0
    ) {
      setSelectedCapsuleIndex(
        selectedCapsuleIndex === 0
          ? capsulesByClass[selectedClassId].length - 1
          : selectedCapsuleIndex - 1,
      )
    }
  }

  useEffect(() => {
    if (
      capsulesByClass[selectedClassId] &&
      capsulesByClass[selectedClassId].length > 0
    ) {
      setCapsuleName(
        `カプセル${(capsulesByClass[selectedClassId]?.length ?? 0) + 1}`,
      )
    }
  }, [capsulesByClass, selectedClassId])

  const onRightChevronClick = () => {
    if (capsulesByClass && capsulesByClass[selectedClassId].length > 0) {
      setSelectedCapsuleIndex(
        selectedCapsuleIndex === capsulesByClass[selectedClassId].length - 1
          ? 0
          : selectedCapsuleIndex + 1,
      )
    }
  }

  const appearance: Appearance = {
    theme: 'stripe',
  }

  const capsulePrices = { SMALL: 9000, MEDIUM: 15000, LARGE: 21000 }
  const capsuleDescriptions = {
    SMALL: '少量のデータを保管するためのカプセルです。小規模な利用に最適です。',
    MEDIUM: '一般的な使用に適した容量です。家庭や小規模なビジネスにおすすめ。',
    LARGE:
      '大量のデータを長期間保管するためのカプセルです。企業や大規模なデータ管理に適しています。',
  }

  const getMediaType = (label: string) => {
    switch (label) {
      case '画像':
        return 'images'
      case '動画':
        return 'movies'
      case '音声':
        return 'voices'
      default:
        return 'texts'
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <AdminHeader />
      {showCreateCapsuleDialog && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="transform rounded-lg shadow-lg p-6 bg-white flex flex-col gap-6 transition-all duration-300">
            <div
              className="w-full flex justify-end cursor-pointer"
              onClick={() => setShowCreateCapsuleDialog(false)}
            >
              <PlusIcon rotate={45} color="#363853" />
            </div>
            <div className="container mx-auto p-4 min-w-[640px]">
              <h1 className="text-2xl mb-4 font-bold">商品購入</h1>
              <p className="text-description mb-8">
                こちらでは、カプセルの購入と保管期間を選択できます。お好みのカプセルを選んで、保管期間を設定してください。購入後、指定の期間中にカプセルを安全に保管し、いつでもアクセス可能です。
              </p>
              <h2 className="text-xl font-bold mb-4">カプセル情報</h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {Object.keys(capsulePrices).map((size) => (
                  <div
                    key={size}
                    className={`border p-4 rounded-lg cursor-pointer ${capsuleSize === size ? 'border-2 border-primary' : 'bg-white'}`}
                    onClick={() =>
                      setCapsuleSize(size as 'SMALL' | 'MEDIUM' | 'LARGE')
                    }
                  >
                    <h2 className="text-xl font-semibold">
                      {size === 'SMALL'
                        ? '小'
                        : size === 'MEDIUM'
                          ? '中'
                          : '大'}
                    </h2>
                    <p className="mt-2">
                      価格: ¥{capsulePrices[size as CapsuleSize]}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      {capsuleDescriptions[size as CapsuleSize]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label className="block">保管期間 (年):</label>
                <Input
                  type="number"
                  value={storageYears > 0 ? storageYears.toString() : '1'}
                  onChange={(e) => {
                    if (e.target.value.length === 0) {
                      setStorageYears(1)
                      return
                    } else if (parseInt(e.target.value) > 33326) {
                      setStorageYears(33326)
                      return
                    }
                    setStorageYears(parseInt(e.target.value))
                  }}
                  className="border px-2 py-1"
                  isError={false}
                />
              </div>
              <div className="mb-4">
                <label className="block">カプセル名</label>
                <Input
                  type="text"
                  value={capsuleName}
                  onChange={(e) => {
                    setCapsuleName(e.target.value)
                    setIsCapsuleNameError(e.target.value.length === 0)
                  }}
                  className="border px-2 py-1"
                  isError={isCapsuleNameError}
                  ref={capsuleNameRef}
                />
                {isCapsuleNameError && (
                  <p className="text-red-500 text-sm">
                    カプセル名を入力してください
                  </p>
                )}
              </div>
              <hr className="mb-4" />
              <Elements stripe={stripePromise} options={{ appearance }}>
                <h2 className="text-xl font-bold mb-4">支払い情報</h2>
                <CheckoutForm
                  capsuleSize={capsuleSize}
                  storageYears={storageYears}
                  amount_sum={capsulePrices[capsuleSize] + 3000 * storageYears}
                  capsule_price={capsulePrices[capsuleSize]}
                  period={storageYears}
                  isCapsuleNameError={isCapsuleNameError}
                  capsuleNameRef={capsuleNameRef}
                />
              </Elements>
            </div>
          </div>
        </div>
      )}
      {capsulesByClass[selectedClassId] && (
        <DashboardGrid layout={layout}>
          <Widget
            key="1"
            className="border border-border"
            title={
              capsulesByClass[selectedClassId]
                ? capsulesByClass[selectedClassId][selectedCapsuleIndex].name
                : ''
            }
            showChevron
            onLeftChevronClick={onLeftChevronClick}
            onRightChevronClick={onRightChevronClick}
          >
            <div className="flex flex-col gap-4">
              <div className="w-full flex justify-end">
                <Button
                  className="p-4 text-white font-bold rounded-xl"
                  onClick={() => setShowCreateCapsuleDialog(true)}
                >
                  カプセルを作成
                </Button>
              </div>
              <div className="flex flex-row gap-6">
                <PieChart
                  series={[
                    {
                      data: MediaData,
                      highlightScope: { fade: 'global', highlight: 'item' },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: 'gray',
                      },
                      valueFormatter,
                    },
                  ]}
                  height={200}
                  slotProps={{
                    legend: { hidden: true },
                  }}
                  className="flex-1 pl-20"
                />
                <div className="flex-1 flex flex-col gap-[18px]">
                  {MediaData.map((data, index) => {
                    const type = getMediaType(data.label)
                    return (
                      <MediaListItem
                        key={index}
                        onClick={() => router.push(`/admin/media/${type}`)}
                        mediaType={data.label}
                        usage={data.value}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          </Widget>
          <Widget key="2" title="メンバー" className="border border-border">
            <div className="flex flex-col gap-2.5 px-4">
              <div className="w-full flex flex-row text-base font-bold text-description">
                <p className="flex-1">名前</p>
                <p className="flex-1">役割</p>
              </div>
              {sortedMembers.map((member) => (
                <MemberItem
                  key={`${member.name}-${member.role}`}
                  name={member.name}
                  role={member.role}
                />
              ))}
            </div>
          </Widget>
        </DashboardGrid>
      )}
    </div>
  )
}
