import { useEffect } from "react";

export default function Cursor(){

    useEffect(()=>{

        const dot=document.getElementById("cursorDot");

        const ring=document.getElementById("cursorRing");

        const touch=window.matchMedia("(hover:none)").matches;

        if(touch) return;

        let mx=0;

        let my=0;

        let rx=0;

        let ry=0;

        const move=e=>{

            mx=e.clientX;

            my=e.clientY;

            dot.style.left=mx+"px";

            dot.style.top=my+"px";

        };

        window.addEventListener("mousemove",move);

        const animate=()=>{

            rx+=(mx-rx)*0.15;

            ry+=(my-ry)*0.15;

            ring.style.left=rx+"px";

            ring.style.top=ry+"px";

            requestAnimationFrame(animate);

        };

        animate();

        return ()=>window.removeEventListener("mousemove",move);

    },[]);



    return(

        <>

            <div id="cursorDot" className="cursor-dot"></div>

            <div id="cursorRing" className="cursor-ring"></div>

        </>

    );

}