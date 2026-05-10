import Navbar from "../components/minimal/Navbar";

const DocsPage = () => {
  return (
    <div style={{ background:'#f5f5f0', color:'#0a0a0a', minHeight:'100vh' }}>
      <Navbar />
      <div style={{ padding:'64px 24px', maxWidth:1120, margin:'0 auto', textAlign:'center' }}>
        <h1 style={{ fontSize:28, fontWeight:500, marginBottom:12 }}>Documentation</h1>
        <p style={{ opacity:.75 }}>Learn how to integrate and use LingoRush effectively.</p>
        <div style={{ marginTop:32, textAlign:'left' }}>
          <h2 style={{ fontSize:22, fontWeight:500, marginBottom:8 }}>Getting Started</h2>
          <p style={{ opacity:.75, marginBottom:8 }}>Welcome to the LingoRush documentation.</p>
          <code style={{ display:'inline-block', background:'#e9e9e4', padding:12, borderRadius:8 }}>
            npm install lingorush-sdk
          </code>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
