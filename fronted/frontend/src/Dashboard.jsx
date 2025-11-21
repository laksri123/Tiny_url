import { useEffect, useState ,} from "react";
import API from "./service/api";
import "./App.css";
import { useNavigate } from "react-router-dom";


function App() {
  const [links, setLinks] = useState([]);
  const [targetUrl, setTargetUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
const [codeError, setCodeError] = useState("");
  const navigate = useNavigate();

  const handleCodeChange = (e) => {
  const v = e.target.value;
  setCode(v);
  if (v && !/^[A-Za-z0-9]{6,8}$/.test(v)) setCodeError("Code must be 6-8 chars, letters & numbers only");
  else setCodeError("");
};


  const fetchLinks = async () => {
    try {
      const res = await API.get("/api/links");
      console.log("res data is", res.data)
      setLinks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addLink = async () => {
    if (!targetUrl.trim()) return alert("URL is required");
    if (codeError) return alert("Fix code error");
      setLoading(true);
    try {
      await API.post("/api/links", {
        target_url: targetUrl,
        targetUrl: targetUrl,
        code: code || undefined,
        });

      setTargetUrl("");
      setCode("");
      fetchLinks();
      
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Custom code already exists");
      } else {
        alert("Error creating link");
      }
    }
  };
 const handleStats = (linkCode) => {
  navigate(`/code/${linkCode}`);
};

  const deleteLink = async (c) => {
    try {
      await API.delete(`/api/links/${c}`);
      fetchLinks();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="container">
      <h1>TinyLink Shortener</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter long URL..."
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          className="input-box"
        />

        <input
          type="text"
          placeholder="Optional custom code..."
          value={code}
          onChange={handleCodeChange}
          className="input-box"
        />
        {codeError && <div className="error">{codeError}</div>}

  <button disabled={loading || codeError} onClick={addLink}>{loading ? "Creating..." : "Create"}</button>

      </div>

     {links.length > 0 && (
        <div className="list-header">
          <span role="img" aria-label="Link icon">🔗</span>
          <span>My Shortened Links</span>
          
        </div>
      )}

      <ul>
        {links.length === 0 && <p>No links found</p>}

        {links.map((item) => (
          <li key={item.code} className="list-item">
            
           
            <div className="link-info"> 
                
                <div className="link-code">
                    <strong>Short URL:</strong>
                    <a
                        href={`https://tiny-url-2-degy.onrender.com/${item.code}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {`https://tiny-url-2-degy.onrender.com/${item.code}`}
                    </a>
                </div>
                
              
                <div className="link-url">
                    <strong>Original:</strong> {item.target_url}
                </div>
                <div>
                   <button onClick={() => handleStats(item.code)}>See Stats</button>

                </div>
            </div>
         

            <button className="delete-btn" onClick={() => deleteLink(item.code)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
