export default function setUpUser(userData, container){
  const selectedCourses = []
    console.log("Setting up user with data:", userData);
    const setUpPanel = document.createElement('div')
    const coursesList = document.createElement('div')
    coursesList.className='courses-list'
    const lecturersList = document.createElement('div')
    lecturersList.className = 'lecturers-list'
    lecturersList.id = 'lecturers-list'

    const coursesListPanel = document.createElement('div')
    coursesListPanel.append(coursesList)
    coursesListPanel.className='courses-list-panel'
    setUpPanel.append(coursesListPanel,lecturersList)
    setUpPanel.className='setup-panel'

    // Placeholder for user setup logic
    // This could involve storing user data in local storage, initializing user session, etc.
    userData.user.courses.forEach(course => {
      // Course element
      const selectedCourse = course.id
      console.log(course.lecturers)
      const courseLecturers = course.lecturers || []
      const courseDiv = document.createElement("div");
      courseDiv.className = "course";
      courseDiv.id = course.id
      courseDiv.textContent = `${course.code} - ${course.name}`;
      coursesList.append(courseDiv)
      // Toggle lecturers on click
      courseDiv.addEventListener("click", () => {
        let selectedCourseLecturers = {}
        let deselectedCourseLecturers = {}
        // Lecturers element
        console.log(selectedCourse)
        const lecturersDiv = document.createElement("div");
        lecturersDiv.className = "lecturers";
        lecturersDiv.id = 'lecturers-list'
        courseLecturers.forEach(lecturer => {
          const manNo = lecturer.man_no
          const label = document.createElement("div");
          label.className = 'lecturers-list-item'
          const checkbox = document.createElement("input");
          checkbox.className='check-box'
          checkbox.type = "checkbox";
          checkbox.name='selected'
          checkbox.value='on'
          checkbox.id = lecturer.man_no
          checkbox.addEventListener('change',
            (e)=>{
              if(checkbox.value ==='on'){
                if(!selectedCourseLecturers.course_id){
                  selectedCourseLecturers = {
                    course_id:selectedCourse,
                    lecturers:[{man_no:manNo, status:'pending'}]}
                }else if(!selectedCourseLecturers.lecturers.find(l=>l.man_no===manNo)){
                  selectedCourseLecturers.lecturers.push({man_no:manNo, status:'pending'})
                }
                if(deselectedCourseLecturers.course_id){
                    deselectedCourseLecturers.lecturers = deselectedCourseLecturers.lecturers.filter(
                      l=>l!==manNo
                    )
                  }
              }else{
                if(!deselectedCourseLecturers.course_id){
                  deselectedCourseLecturers = {
                    course_id:selectedCourse,
                    lecturers:[manNo]}
                }else if(!deselectedCourseLecturers.lecturers.includes(manNo)){
                  deselectedCourseLecturers.lecturers.push(manNo)
                }
                if(selectedCourseLecturers.course_id){
                    selectedCourseLecturers.lecturers = selectedCourseLecturers.lecturers.filter(
                    l=>l.man_no!==manNo
                  )
                }
              }
              console.log(lecturer,checkbox.checked,selectedCourseLecturers,deselectedCourseLecturers)
              checkbox.value ==='on'?checkbox.value='off':checkbox.value='on'
            }
          )
          label.appendChild(checkbox);
          const lecturersName = document.createElement('div')
          lecturersName.innerHTML=" " + lecturer.first_name+' '+lecturer.surname
          label.appendChild(lecturersName);
          lecturersName.className='lecturers-name'
          lecturersDiv.appendChild(label);
          lecturersDiv.appendChild(document.createElement("br"));
          
        });
        const confirmButton = document.createElement('button')
        confirmButton.id = 'confirm-lecturers-list'
        confirmButton.setAttribute('student-id',userData.user.comp_no)
        confirmButton.setAttribute('course-id',course.id)
        confirmButton.innerHTML='Confirm'
        confirmButton.className='btn btn-primary confirm-selection'
        confirmButton.addEventListener('click',
          (e)=>{
            e.preventDefault(e.target)
            
            console.log(selectedCourses,selectedCourseLecturers)
          }
        )
        lecturersDiv.appendChild(confirmButton)
        lecturersList.innerHTML=''
        lecturersList.append(lecturersDiv)
      });
    container.innerHTML = ''
    container.append(setUpPanel);
  })
}
