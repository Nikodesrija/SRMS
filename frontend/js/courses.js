function loadCourses(){

apiGet("/courses").then(data=>{

let table=document.getElementById("coursesTable")

table.innerHTML=""

data.forEach(c=>{

let row=`<tr>
<td>${c.courseId}</td>
<td>${c.courseName}</td>
<td>${c.courseCode}</td>
</tr>`

table.innerHTML+=row

})

})

}

window.onload=loadCourses