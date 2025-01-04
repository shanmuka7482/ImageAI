import AvatarResult from "./AvatarResult";
import Home from "./Home/Home";
import Result from "./Result";
import { Route, Routes, BrowserRouter } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alt-result" element={<Result />} />
          <Route path="/Avatar-result" element={<AvatarResult />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
