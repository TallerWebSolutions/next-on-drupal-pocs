export default ({ children }) => (
  <main>
    {children}
    <style jsx global>{`
      * {
        font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, serif;
      }
      body {
        margin: 0;
        padding: 25px 50px;
      }
    `}</style>
  </main>
)
