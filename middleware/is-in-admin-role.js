export default function(context) {
  console.log("[Middleware] Is in Admin role")
  if (!context.store.getters.userRoles.includes('Admin')) {
    context.redirect("/dashboard")
    console.log('This user dose not have Admin permitions')
  }  
}