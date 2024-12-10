import projectRoutes from './project.router'
import chartRoutes from './chart.route'
import previewRoutes from './preview.route'
import editRoutes from './edit.route'

export default {
  projectRoutes,
  chartRoutes,
  previewRoutes:previewRoutes.chartRoutes,
  metaRoutes:previewRoutes.metaRoutes,
  editRoutes
}