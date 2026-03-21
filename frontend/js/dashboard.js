let deptChartInstance = null;
let roleChartInstance = null;

function showSection(sectionId) {

    const sections = document.querySelectorAll('.content-section');

    sections.forEach(section=>{
        section.classList.add('d-none');
    });

    const selected=document.getElementById(sectionId);

    if(selected){
        selected.classList.remove('d-none');
    }

    const menuItems=document.querySelectorAll('.menu-item');

    menuItems.forEach(item=>{
        item.classList.remove('active');
    });

    const activeItem=document.querySelector(`[onclick="showSection('${sectionId}')"]`);

    if(activeItem){
        activeItem.classList.add('active');
    }
     if(sectionId === "dashboard"){
        loadAnalytics();
    }
}


/* ================================
   DASHBOARD STATISTICS
================================ */

function loadStats(){

    /* Students */

    apiGet("/students").then(data=>{

        if(document.getElementById("totalStudents")){
            document.getElementById("totalStudents").innerText=data.length;
        }

    }).catch(err=>console.error(err));


    /* Courses */

    apiGet("/courses").then(data=>{

        if(document.getElementById("totalCourses")){
            document.getElementById("totalCourses").innerText=data.length;
        }

    }).catch(err=>console.error(err));


    /* Users + Staff */

    apiGet("/users").then(data=>{

        if(!Array.isArray(data)) return;

        if(document.getElementById("totalUsers")){
            document.getElementById("totalUsers").innerText=data.length;
        }

        const staff=data.filter(u=>
            (u.role || "").toLowerCase()==="staff"
        );

        if(document.getElementById("totalStaff")){
            document.getElementById("totalStaff").innerText=staff.length;
        }

    }).catch(err=>console.error(err));

}


/* ================================
   ANALYTICS CHARTS
================================ */

function loadAnalytics(){

    if(typeof Chart==="undefined"){
        console.warn("Chart.js not loaded");
        return;
    }

    const deptChart=document.getElementById("deptChart");
    const roleChart=document.getElementById("roleChart");

    if(!deptChart && !roleChart){
        return;
    }


    /* ================================
       STUDENTS BY DEPARTMENT
    ================================= */

    if(deptChart){

        apiGet("/students").then(data=>{

            let deptCount={};

            data.forEach(s=>{

                let dept=s.department || "Unknown";

                deptCount[dept]=(deptCount[dept] || 0)+1;

            });

            const labels=Object.keys(deptCount);
            const values=Object.values(deptCount);

        if(deptChartInstance){
            deptChartInstance.destroy();
        }

        deptChartInstance = new Chart(deptChart.getContext("2d"),{

                type:"pie",

                data:{
                    labels:labels,
                    datasets:[{
                        data:values,
                        backgroundColor:[
                            "#4A90E2",
                            "#27AE60",
                            "#F39C12",
                            "#8E44AD",
                            "#16A085"
                        ]
                    }]
                },

                options:{
                    responsive:true,
                    plugins:{
                        legend:{
                            position:"bottom"
                        }
                    }
                }

            });

        }).catch(err=>console.error(err));

    }



    /* ================================
       USER ROLE DISTRIBUTION
    ================================= */

    if(roleChart){

        apiGet("/users").then(data=>{

            let roleCount={};

            data.forEach(u=>{

                let role=(u.role || "unknown").toUpperCase();

                roleCount[role]=(roleCount[role] || 0)+1;

            });

            const labels=Object.keys(roleCount);
            const values=Object.values(roleCount);
            

            if(roleChartInstance){
                roleChartInstance.destroy();
        }

        roleChartInstance = new Chart(roleChart.getContext("2d"),{

                type:"bar",

                data:{
                    labels:labels,
                    datasets:[{
                        label:"Users",
                        data:values,
                        backgroundColor:"#4A90E2"
                    }]
                },

                options:{
                    responsive:true,
                    plugins:{
                        legend:{display:false}
                    },
                    scales:{
                        y:{
                            beginAtZero:true
                        }
                    }
                }

            });

        }).catch(err=>console.error(err));

    }

}


document.addEventListener("DOMContentLoaded", function(){

    if(typeof checkAuth === "function"){
        checkAuth();
    }

    if(typeof updateUserInfo === "function"){
        updateUserInfo();
    }

    loadStats();

    // load charts only if they exist
    const dept = document.getElementById("deptChart");
    const role = document.getElementById("roleChart");

    if(dept || role){
        loadAnalytics();
    }

});