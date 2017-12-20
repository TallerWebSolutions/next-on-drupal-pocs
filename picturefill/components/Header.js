import Link from 'next/link'

export default ({ pathname }) => (
  <header>
    <Link prefetch href='/'>
      <a className={pathname === '/' && 'is-active'}>Home</a>
    </Link>
    <Link prefetch href='/products'>
      <a className={pathname === '/products' && 'is-active'}>Products</a>
    </Link>
    <Link prefetch href='/about'>
      <a className={pathname === '/about' && 'is-active'}>About</a>
    </Link>
    <style jsx>{`
      header {
        margin-bottom: 25px;
      }
      a {
        font-size: 14px;
        margin-right: 15px;
        text-decoration: none;
        padding: 10px;
        border: 1px solid #F2F2F2;
        color: #999;
      }
      .is-active {
        font-weight: bold;
        background-color: #AAA;
        border-color: #AAA;
        color: white;
      }
    `}</style>
  </header>
)
