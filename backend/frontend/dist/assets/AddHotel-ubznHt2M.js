import{a as m,j as t,i as n}from"./index-MjoGkJKq.js";import{u as d}from"./useMutation-zklkFzjD.js";import{M as l}from"./ManageHotelForm-1XhQIoeX.js";import"./index.esm-JOZrsEaS.js";import"./hotel-options-config-qeZf1OSv.js";const S=()=>{const{showToast:o}=m(),{mutate:s,isLoading:e}=d(n,{onSuccess:()=>{o({message:"Hotel Saved!",type:"SUCCESS"})},onError:()=>{o({message:"Error Saving Hotel",type:"ERROR"})}}),a=r=>{s(r)};return t.jsxs("div",{className:"p-4 sm:p-6 md:p-8",children:[t.jsx("h1",{className:"text-2xl sm:text-3xl font-bold mb-4",children:"Add Hotel"}),t.jsx(l,{onSave:a,isLoading:e})]})};export{S as default};
