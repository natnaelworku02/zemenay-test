"use client"

function Footer() {
  return (
    <footer className="border-t border-border/70 bg-white/90 backdrop-blur dark:bg-slate-900/90 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:text-slate-300">
        <p>© {new Date().getFullYear()} Modern Market. Crafted for demo purposes.</p>
        <p>Powered by DummyJSON + Next.js + Redux Toolkit.</p>
      </div>
    </footer>
  )
}

export default Footer
