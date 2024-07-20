import{j as e,L as b,c as P,r as o,k as F,p as H}from"./index-MjoGkJKq.js";import{A as O}from"./index.esm-Byi_Ytq7.js";import{h as R,a as I}from"./hotel-options-config-qeZf1OSv.js";import"./iconBase-zMJGrWL1.js";const $=({hotel:s})=>e.jsxs("div",{className:"border border-slate-300 rounded-lg p-4 bg-white shadow-md hover:shadow-lg flex flex-col  dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-white",children:[e.jsx("div",{className:"w-full h-[200px]",children:e.jsx("img",{src:s.imageUrls[0],alt:s.name,className:"w-full h-full object-cover object-center rounded-lg"})}),e.jsxs("div",{className:"flex flex-col justify-between flex-grow mt-4",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center mb-2",children:[e.jsx("span",{className:"flex",children:Array.from({length:s.starRating},(l,t)=>e.jsx(O,{className:"fill-yellow-400 w-5 h-5"},t))}),e.jsx("span",{className:"ml-2 text-sm text-gray-600",children:s.type})]}),e.jsx(b,{to:`/detail/${s._id}`,className:"text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors",children:s.name}),e.jsx("p",{className:"mt-2 text-sm line-clamp-3",children:s.description})]}),e.jsxs("div",{className:"mt-4",children:[e.jsxs("div",{className:"flex flex-wrap gap-2 mb-3",children:[s.facilities.slice(0,3).map((l,t)=>e.jsx("span",{className:"bg-slate-200 px-2 py-1 rounded-full text-xs font-semibold text-gray-700",children:l},`facility-${t}`)),s.facilities.length>3&&e.jsxs("span",{className:"text-xs",children:["+",s.facilities.length-3," more"]})]}),e.jsxs("div",{className:"flex justify-between items-center mt-4",children:[e.jsxs("span",{className:"font-bold text-lg",children:["₹",s.pricePerNight," per night"]}),e.jsx(b,{to:`/detail/${s._id}`,className:"bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors",children:"View Details"})]})]})]})]}),A=({page:s,pages:l,onPageChange:t})=>{const d=[];for(let r=1;r<=l;r++)d.push(r);return e.jsx("div",{className:"flex justify-center",children:e.jsx("ul",{className:"flex border border-slate-300",children:d.map(r=>e.jsx("li",{className:`px-2 py-1 ${s===r?"bg-gray-200":""}`,children:e.jsx("button",{onClick:()=>t(r),children:r})},r))})})},_=({selectedStars:s,onChange:l})=>e.jsxs("div",{className:"border-b border-slate-300 pb-5",children:[e.jsx("h4",{className:"text-md font-semibold mb-2",children:"Property Rating"}),["5","4","3","2","1"].map(t=>e.jsxs("label",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"checkbox",className:"rounded",value:t,checked:s.includes(t),onChange:l}),e.jsxs("span",{children:[t," Stars"]})]},t))]}),T=({selectedHotelTypes:s,onChange:l})=>e.jsxs("div",{className:"border-b border-slate-300 pb-5",children:[e.jsx("h4",{className:"text-md font-semibold mb-2",children:"Hotel Type"}),R.map(t=>e.jsxs("label",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"checkbox",className:"rounded",value:t,checked:s.includes(t),onChange:l}),e.jsx("span",{children:t})]},t))]}),E=({selectedFacilities:s,onChange:l})=>e.jsxs("div",{className:"border-b border-slate-300 pb-5",children:[e.jsx("h4",{className:"text-md font-semibold mb-2",children:"Facilities"}),I.map((t,d)=>e.jsxs("label",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"checkbox",className:"rounded",value:t,checked:s.includes(t),onChange:l}),e.jsx("span",{children:t})]},d))]}),L=({selectedPrice:s,onChange:l})=>e.jsxs("div",{children:[e.jsx("h4",{className:"text-md font-semibold mb-2",children:" Max Price"}),e.jsxs("select",{className:"p-2 border rounded-md w-full",value:s,onChange:t=>l(t.target.value?parseInt(t.target.value):void 0),children:[e.jsx("option",{value:"",children:"Select Max Price"},""),[50,100,200,300,500].map(t=>e.jsx("option",{value:t,children:t},t))]})]}),V=()=>{const s=P(),[l,t]=o.useState(1),[d,r]=o.useState([]),[g,f]=o.useState([]),[p,N]=o.useState([]),[m,v]=o.useState(),[u,S]=o.useState(""),[h,y]=o.useState(!1),j={destination:s.destination,checkIn:s.checkIn.toISOString(),checkOut:s.checkOut.toISOString(),adultCount:s.adultCount.toString(),childCount:s.childCount.toString(),page:l.toString(),stars:d,types:g,facilities:p,maxPrice:m==null?void 0:m.toString(),sortOption:u},{data:i}=F(["searchHotels",j],()=>H(j)),w=a=>{const c=a.target.value;r(n=>a.target.checked?[...n,c]:n.filter(x=>x!==c))},k=a=>{const c=a.target.value;f(n=>a.target.checked?[...n,c]:n.filter(x=>x!==c))},C=a=>{const c=a.target.value;N(n=>a.target.checked?[...n,c]:n.filter(x=>x!==c))};return e.jsxs("div",{className:"grid grid-cols-1 gap-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:[e.jsx("div",{className:"mb-4",children:e.jsx("button",{onClick:()=>y(!h),className:"bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors",children:h?"Hide Filters":"Show Filters"})}),h&&e.jsx("div",{className:"bg-white shadow-md rounded-lg border border-slate-300 p-5",children:e.jsxs("div",{className:"space-y-5",children:[e.jsx("h3",{className:"text-lg font-semibold border-b border-slate-300 pb-5",children:"Filter by:"}),e.jsx(_,{selectedStars:d,onChange:w}),e.jsx(T,{selectedHotelTypes:g,onChange:k}),e.jsx(E,{selectedFacilities:p,onChange:C}),e.jsx(L,{selectedPrice:m,onChange:a=>v(a)})]})}),e.jsxs("div",{className:"flex flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-center mb-4",children:[e.jsxs("span",{className:"text-xl font-bold mb-2 sm:mb-0",children:[i==null?void 0:i.pagination.total," Hotels found",s.destination?` in ${s.destination}`:""]}),e.jsxs("select",{value:u,onChange:a=>S(a.target.value),className:"p-2 border rounded-md w-full sm:w-auto",children:[e.jsx("option",{value:"",children:"Sort By"}),e.jsx("option",{value:"starRating",children:"Star Rating"}),e.jsx("option",{value:"pricePerNightAsc",children:"Price Per Night (low to high)"}),e.jsx("option",{value:"pricePerNightDesc",children:"Price Per Night (high to low)"})]})]}),e.jsx("div",{className:"grid gap-5 sm:grid-cols-2 lg:grid-cols-3",children:i==null?void 0:i.data.map(a=>e.jsx($,{hotel:a},a._id))}),e.jsx("div",{className:"mt-6",children:e.jsx(A,{page:(i==null?void 0:i.pagination.page)||1,pages:(i==null?void 0:i.pagination.pages)||1,onPageChange:a=>t(a)})})]})]})};export{V as default};
