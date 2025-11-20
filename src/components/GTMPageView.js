import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function GTMPageView() {
const location = useLocation();

useEffect(() => {
    console.log("location changed");
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
event: "react_page_view_bc",
page_path: location.pathname + location.search,
page_title: document.title
});
}, [location]);

return null;
}
