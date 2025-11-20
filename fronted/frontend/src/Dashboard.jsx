import { useEffect, useState ,} from "react";
import API from "./service/api";
import "./App.css";
import { useNavigate } from "react-router-dom";


function App() {
  const [links, setLinks] = useState([]);
  const [targetUrl, setTargetUrl] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();


  const fetchLinks = async () => {
    try {
      const res = await API.get("/api/links");
      setLinks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addLink = async () => {
    if (!targetUrl.trim()) return alert("URL is required");

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
  navigate(`/stats/${linkCode}`);
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
          onChange={(e) => setCode(e.target.value)}
          className="input-box"
        />

        <button className="btn" onClick={addLink}>
          Create
        </button>
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
                        href={`http://localhost:9000/${item.code}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {`http://localhost:9000/${item.code}`}
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
