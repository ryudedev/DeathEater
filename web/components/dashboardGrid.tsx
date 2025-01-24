import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

interface DashboardGridProps {
  layout: { i: string; x: number; y: number; w: number; h: number }[]
  children: React.ReactNode[]
}

export default function DashboardGrid({
  layout,
  children,
}: DashboardGridProps) {
  return (
    <div className="w-screen mx-auto px-4">
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30} // 1行の高さを調整
        isResizable={true}
        isDraggable={true}
        draggableHandle=".drag-handle"
      >
        {layout.map((item, index) => (
          <div key={item.i}>{children[index]}</div>
        ))}
      </ResponsiveGridLayout>
    </div>
  )
}
