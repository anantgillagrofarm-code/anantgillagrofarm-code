import React from 'react'

export default function App(){
  return (
    <div style={{minHeight:'100vh', background:'#0f3a1f', color:'#f4efe5', padding:20}}>
      <header style={{display:'flex', alignItems:'center', gap:16}}>
        <img src="/anant_gill_logo.svg" alt="logo" style={{width:100}} />
        <h1 style={{color:'#e6c79a'}}>ANANT GILL AGRO FARM</h1>
      </header>

      <main style={{marginTop:30}}>
        <h2>Fresh Organic Mushrooms &amp; Products</h2>
        <p>Welcome to Anant Gill Agro Farm. We sell fresh mushrooms, pickles, dry mushrooms, mushroom powder and mushroom warriyan.</p>

        <section style={{marginTop:20, background:'rgba(255,255,255,0.05)', padding:16, borderRadius:8}}>
          <h3>Sample Products</h3>
          <ul>
            <li>Fresh Mushrooms — ₹200 / kg</li>
            <li>Mushroom Pickle — ₹500 / kg</li>
            <li>Dry Mushrooms — ₹600 / 250g</li>
            <li>Mushroom Powder — ₹400 / 100g</li>
          </ul>
        </section>
      </main>

      <footer style={{marginTop:30, opacity:0.9}}>
        <p>© {new Date().getFullYear()} Anant Gill Agro Farm</p>
      </footer>
    </div>
  )
}
