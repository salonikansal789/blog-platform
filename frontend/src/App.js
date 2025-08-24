import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import AddPost from "./components/AddPost";
import { ToastContainer } from "react-toastify";
import NotFound from "./components/pages/NotFound";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="container">
            <h1>
              <Link to="/">Blog Platform</Link>
            </h1>
            <nav>
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/add-post" className="nav-link">
                Add Post
              </Link>
            </nav>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/add-post" element={<AddPost />} />

            {/* Catch-all for wrong routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
