import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarPresenter from './presenters/NavbarPresenter.jsx';
import HomePresenter from './presenters/HomePresenter.jsx';
import StorePresenter from './presenters/StorePresenter.jsx';
import AboutUsPresenter from './presenters/AboutUsPresenter.jsx';
import PokedexPresenter from './presenters/PokedexPresenter.jsx';
import ShoppingCartPresenter from './presenters/ShoppingCartPresenter.jsx';
import LoginPresenter from './presenters/LoginPresenter.jsx';
import PacksPresenter from './presenters/PacksPresenter.jsx';
import CollectionPresenter from './presenters/CollectionPresenter.jsx';
import { createHashRouter,  RouterProvider} from "react-router-dom";
import { observer } from "mobx-react-lite";
import RequireAuth from './protectedRoutes.jsx';


/*
export default
observer(    
function ReactRoot(props){
    const routes = [
        {
          path: "/",
          element: <HomePresenter model={props.model} />,
        },
        {
          path: "/pokedex",
          element: <PokedexPresenter model={props.model} />
        },
        {
          path: "/store",
          element: <StorePresenter model={props.model} />
        },
        {
          path: "/packs",
          element: <PacksPresenter model={props.model} />
        },
        {
          path: "/about",
          element: <AboutUsPresenter model={props.model} />
        }
      ];
    
      return (
        <div>
            <div>
                <NavbarPresenter />
            </div>
          
          <div>
            <RouterProvider router={createHashRouter(routes)} />
          </div>
        </div>
      );
});
  */





export default observer(function ReactRoot(props) {
  return (
    <Router>
      <NavbarPresenter />
      <Routes>
        <Route path="/" element={<HomePresenter />} />
        <Route path="/pokedex" element={<PokedexPresenter model={props.model} />} />
        <Route path="/about" element={<AboutUsPresenter />} />
        <Route path="/login" element={<LoginPresenter />} />
        
        {/* Private routes by wrapping them with RequireAuth */}
        <Route element={<RequireAuth />}>
          <Route path="/store" element={<StorePresenter />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/cart" element={<ShoppingCartPresenter model = {props.model}/>} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/packs" element={<PacksPresenter model = {props.model}/>} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/collection" element={<CollectionPresenter />} />
        </Route>

      </Routes>
    </Router>
  );
});