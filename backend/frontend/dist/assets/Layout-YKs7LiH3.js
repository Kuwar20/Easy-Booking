import{j as e,u as A,a as D,s as B,r as l,L as d,b as H,c as z,R as T,d as q}from"./index-MjoGkJKq.js";import{u as L}from"./useMutation-zklkFzjD.js";import{F as P,a as G,b as K,c as k,d as C,e as Q,f as U,g as V}from"./index.esm-vGOlp4xa.js";import{G as Y}from"./iconBase-zMJGrWL1.js";import{e as S}from"./index-5JCR8a3y.js";const $=()=>e.jsx("div",{children:e.jsx("footer",{className:"bg-blue-700 py-6 md:py-10  dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-black",children:e.jsxs("div",{className:"w-full max-w-screen-xl mx-auto p-4 md:py-8",children:[e.jsxs("div",{className:"sm:flex sm:items-center sm:justify-between",children:[e.jsx("a",{href:"#",className:"flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse",children:e.jsx("span",{className:"self-center text-2xl font-semibold whitespace-nowrap text-white",children:"Booking.com"})}),e.jsxs("ul",{className:"flex flex-wrap items-center mb-6 text-sm font-medium text-white sm:mb-0 dark:text-white",children:[e.jsx("li",{children:e.jsx("a",{href:"#",className:"hover:underline me-4 md:me-6",children:"About"})}),e.jsx("li",{children:e.jsx("a",{href:"#",className:"hover:underline me-4 md:me-6",children:"Privacy Policy"})}),e.jsx("li",{children:e.jsx("a",{href:"#",className:"hover:underline me-4 md:me-6",children:"Licensing"})}),e.jsx("li",{children:e.jsx("a",{href:"#",className:"hover:underline",children:"Contact"})})]})]}),e.jsx("hr",{className:"my-6 border-gray-200 sm:mx-auto dark:border-gray-700  lg:my-8"}),e.jsxs("span",{className:"block text-sm text-white sm:text-center dark:text-white",children:["© 2023 ",e.jsx("a",{href:"#",className:"hover:underline",children:"Booking.com"}),". All Rights Reserved."]})]})})}),M=()=>{const t=A(),{showToast:n}=D(),a=L(B,{onSuccess:async()=>{await t.invalidateQueries("validateToken"),n({message:"Signed out successfully",type:"SUCCESS"})},onError:i=>{n({message:i.message,type:"ERROR"})}}),m=()=>{a.mutate()};return e.jsxs("button",{onClick:m,className:"bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-100 hover:text-blue-700 transition duration-200 flex items-center shadow-md  dark:bg-gray-700 dark:text-white",children:["Sign Out",e.jsx(P,{className:"ml-2"})]})},g=()=>{const[t,n]=l.useState(()=>localStorage.getItem("darkMode")==="true"||!1);return l.useEffect(()=>{t?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark"),localStorage.setItem("darkMode",t.toString())},[t]),e.jsx("button",{onClick:()=>n(!t),className:"p-2 rounded-full bg-gray-200 dark:bg-gray-600 transition-colors duration-300",children:t?e.jsx(G,{className:"text-yellow-400"}):e.jsx(K,{className:"text-gray-700"})})},W=()=>{const{isLoggedIn:t}=D(),[n,a]=l.useState(!1);return e.jsx("header",{className:"bg-blue-700 py-4 shadow-lg  dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-black",children:e.jsxs("div",{className:"max-w-6xl mx-auto px-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(d,{to:"/",className:"flex items-center space-x-2",children:e.jsx("span",{className:"text-2xl text-white font-bold tracking-tight",children:"Easy Booking"})}),e.jsx("nav",{className:"flex items-center space-x-4",children:t?e.jsxs("div",{className:"hidden sm:flex items-center space-x-4",children:[e.jsxs(d,{className:"text-white hover:bg-blue-600 px-3 py-2 rounded-md transition duration-300 flex items-center",to:"/my-bookings",children:[e.jsx(k,{className:"mr-2"}),"My Bookings"]}),e.jsxs(d,{className:"text-white hover:bg-blue-600 px-3 py-2 rounded-md transition duration-300 flex items-center",to:"/my-hotels",children:[e.jsx(C,{className:"mr-2"}),"My Hotels"]}),e.jsx(g,{}),e.jsx(M,{})]}):e.jsxs(e.Fragment,{children:[e.jsx(g,{}),e.jsxs(d,{to:"/sign-in",className:"bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50 hover:text-blue-700 transition duration-300 flex items-center shadow-md",children:["Sign In",e.jsx(Q,{className:"ml-2"})]})]})}),t&&e.jsxs("div",{className:"sm:hidden flex items-center space-x-2",children:[e.jsx(g,{}),e.jsx("button",{onClick:()=>a(!n),className:"text-white hover:bg-blue-600 p-2 rounded-md transition duration-300",children:e.jsx(U,{size:20})})]})]}),n&&e.jsxs("div",{className:"sm:hidden flex flex-col items-center mt-4 space-y-2",children:[e.jsxs(d,{className:"text-white hover:bg-blue-600 px-3 py-2 rounded-md transition duration-300 flex items-center",to:"/my-bookings",children:[e.jsx(k,{className:"mr-2"}),"My Bookings"]}),e.jsxs(d,{className:"text-white hover:bg-blue-600 px-3 py-2 rounded-md transition duration-300 flex items-center",to:"/my-hotels",children:[e.jsx(C,{className:"mr-2"}),"My Hotels"]}),e.jsx(M,{})]})]})})},J=()=>e.jsx("div",{className:"bg-blue-700 pb-8 md:pb-16 dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-black border-b border-white dark:border-white",children:e.jsx("div",{className:"max-w-6xl mx-auto px-4",children:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("h1",{className:"text-2xl sm:text-4xl md:text-5xl text-white font-bold mb-2 sm:mb-4 ",children:"Find your next destination"}),e.jsx("p",{className:"text-md sm:text-xl text-white",children:"Search Low Cost Hotels at your favorite destination"})]})})});function X(t){return Y({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"}},{tag:"path",attr:{d:"M19.3 16.9c.4-.7.7-1.5.7-2.4 0-2.5-2-4.5-4.5-4.5S11 12 11 14.5s2 4.5 4.5 4.5c.9 0 1.7-.3 2.4-.7l3.2 3.2 1.4-1.4-3.2-3.2zm-3.8.1c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zM12 20v2C6.48 22 2 17.52 2 12S6.48 2 12 2c4.84 0 8.87 3.44 9.8 8h-2.07A8 8 0 0015 4.59V5c0 1.1-.9 2-2 2h-2v2c0 .55-.45 1-1 1H8v2h2v3H9l-4.79-4.79C4.08 10.79 4 11.38 4 12c0 4.41 3.59 8 8 8z"}}]})(t)}const Z=()=>{const t=H(),n=z(),[a,m]=l.useState(n.destination),[i,c]=l.useState([]),[x,f]=l.useState(n.checkIn),[u,p]=l.useState(n.checkOut),[b,j]=l.useState(n.adultCount),[w,y]=l.useState(n.childCount),R=l.useRef(null),{mutate:I}=L(q,{onSuccess:s=>{if(console.log("API response:",s),s.length>0){const o=s.filter(r=>r.name.toLowerCase().includes(a.toLowerCase())||r.city.toLowerCase().includes(a.toLowerCase())||r.country.toLowerCase().includes(a.toLowerCase())).map(r=>r.name.toLowerCase().includes(a.toLowerCase())?r.name:r.city.toLowerCase().includes(a.toLowerCase())?`${r.city}, ${r.country}`:r.country);console.log("Matching suggestions:",o),c([...new Set(o)])}else c([])},onError:s=>{console.error("Error fetching suggestions:",s),s.response?(console.log("Response data:",s.response.data),console.log("Response status:",s.response.status),console.log("Response headers:",s.response.headers)):s.request?console.log("Request data:",s.request):console.log("Error message:",s.message),console.log("Error config:",s.config),c([])}}),E=async s=>{let o=s.target.value;if(m(o),o.length>=2)try{I(o),console.log("Fetching suggestions for:",o)}catch(r){console.error("Error fetching suggestions:",r),c([])}else c([])},F=s=>{s.key==="ArrowRight"&&i.length>0&&(m(i[0]),c([]))},O=s=>{s.preventDefault(),n.saveSearchValues(a,x,u,b,w),t("/search")},v=new Date,h=new Date;h.setFullYear(h.getFullYear()+1);const N=T.forwardRef(({value:s,onClick:o},r)=>e.jsxs("button",{className:"w-full min-w-0 bg-white p-2 focus:outline-none flex items-center",onClick:o,ref:r,children:[e.jsx(V,{className:"mr-2",style:{fontSize:"20px",marginRight:"10px"}}),s]}));return e.jsxs("form",{onSubmit:O,className:"-mt-8 p-3 bg-orange-400 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4 dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-black border border-gray-200 dark:border-white",children:[e.jsxs("div",{className:"flex flex-row items-center flex-1 bg-white p-2 relative",children:[e.jsx(X,{size:25,className:"mr-2"}),e.jsxs("div",{className:"relative w-full",children:[e.jsx("input",{ref:R,type:"text",placeholder:"Where are you going?",className:"text-md w-full focus:outline-none",value:a,spellCheck:"false",onChange:E,onKeyDown:F}),i.length>0&&a.length>0&&e.jsxs("div",{className:"absolute inset-y-0 left-0 flex items-center pointer-events-none",children:[e.jsx("span",{className:"text-transparent",children:a}),e.jsx("span",{className:"text-gray-400",children:i[0].slice(i[0].toLowerCase().indexOf(a.toLowerCase())+a.length)})]})]})]}),e.jsxs("div",{className:"flex bg-white px-2 py-1 gap-2",children:[e.jsxs("label",{className:"items-center flex",children:["Adults:",e.jsx("input",{className:"w-full p-1 focus:outline-none font-bold",type:"number",min:1,max:20,value:b,onChange:s=>j(parseInt(s.target.value))})]}),e.jsxs("label",{className:"items-center flex",children:["Children:",e.jsx("input",{className:"w-full p-1 focus:outline-none font-bold",type:"number",min:0,max:20,value:w,onChange:s=>y(parseInt(s.target.value))})]})]}),e.jsx("div",{className:"flex items-center",children:e.jsx(S,{selected:x,onChange:s=>f(s),selectsStart:!0,startDate:x,endDate:u,minDate:v,maxDate:h,placeholderText:"Check-in Date",customInput:e.jsx(N,{}),className:"w-full min-w-0 bg-white p-2 focus:outline-none",wrapperClassName:"min-w-full"})}),e.jsx("div",{children:e.jsx(S,{selected:u,onChange:s=>p(s),selectsStart:!0,startDate:x,endDate:u,minDate:v,maxDate:h,placeholderText:"Check-out Date",customInput:e.jsx(N,{}),className:"w-full min-w-0 bg-white p-2 focus:outline-none",wrapperClassName:"min-w-full"})}),e.jsxs("div",{className:"flex gap-1",children:[e.jsx("button",{className:"w-2/3 bg-blue-600 text-white p-2 font-bold rounded hover:bg-blue-500 transition-colors",children:"Search"}),e.jsx("button",{className:"w-2/3 bg-red-600 text-white p-2 font-bold rounded hover:bg-red-500 transition-colors",type:"button",onClick:()=>{m(""),f(new Date),p(new Date),j(1),y(0)},children:"Clear"})]})]})},ne=({children:t})=>e.jsxs("div",{className:"flex flex-col min-h-screen w-full overflow-x-hidden dark:bg-gray-800 transition-colors duration-300 text-gray-900 dark:text-black",children:[e.jsx(W,{}),e.jsx(J,{}),e.jsx("div",{className:"container mx-auto",children:e.jsx(Z,{})}),e.jsx("div",{className:"container mx-auto py-5 flex-1",children:t}),e.jsx($,{})]});export{ne as default};
