const getData = (query)=>{
    const dataJSON = localStorage.getItem(query)
    if(dataJSON !== null){
        return JSON.parse(dataJSON)
    } else {
        return []
    }
}

const randomThree = (arry)=>{
    let newArry = []
    if(arry.length > 3){
        for(let i = 0; i < 3; i++){
            if(arry.length < 3){
                newArry.push(arry[0])
                return newArry
            }
            const randomNum = Math.floor(Math.random()*arry.length)
            newArry.push(arry[randomNum])
            arry.splice(randomNum, 1)
        }
    } 
    localStorage.setItem('featuredCourses', JSON.stringify(arry))
}

const generateColorText = (color, text)=>{
    let textEl = document.createElement('span')
    textEl.classList.add(color)
    textEl.textContent = text
    return textEl
}

const returnStringRes = (course, name)=>{
    let avgRate
    switch(name){
        case 'hw':
            avgRate = course.avgHwLoad
            if(avgRate <= 1){
                return generateColorText('text-primary', '~ 5 minutes')
            } else if(avgRate <= 2){
                return generateColorText('text-info', '~ 15 minutes')
            } else if(avgRate <= 3){
                return generateColorText('text-success', '~ 30-45 minutes')
            } else if(avgRate <= 4){
                return generateColorText('text-warning', '> 1 hour')
            } else if(avgRate <= 5){
                return generateColorText('text-danger', '> 2 hours')
            }
            break
        case 'diff':
            avgRate = course.avgDifficulty
            if(avgRate <= 1){
                return generateColorText('text-primary', 'Easy A')
            } else if(avgRate <= 2){
                return generateColorText('text-info', 'Study a little')
            } else if(avgRate <= 3){
                return generateColorText('text-success', 'Study quite a bit')
            } else if(avgRate <= 4){
                return generateColorText('text-warning', 'Hard A')
            } else if(avgRate <= 5){
                return generateColorText('text-danger', 'Impossible A')
            }
            break
        case 'time':
            avgRate = course.avgTime
            if(avgRate <= 1){
                return generateColorText('text-primary', '< 30 minutes per week')
            } else if(avgRate <= 2){
                return generateColorText('text-info', '~ 1 hour per week')
            } else if(avgRate <= 3){
                return generateColorText('text-success', '> 1 hour per week')
            } else if(avgRate <= 4){
                return generateColorText('text-warning', '> 3 hours per week')
            } else if(avgRate <= 5){
                return generateColorText('text-danger', 'Will make you stay up past midnight every night')
            }
            break
    }
}

const generateCardDOM = (title, bodyContent, modalId)=>{
    let parentCard = document.createElement('div')
    parentCard.classList.add('card', 'mb-3', 'custom-card')
    let cardTitle = document.createElement('h5')
    cardTitle.classList.add('card-header')
    cardTitle.textContent = title
    let cardBody = document.createElement('div')
    let cardButton = document.createElement('button')
    cardButton.classList.add('btn', 'btn-primary', 'float-right')
    cardButton.textContent = 'Reviews'
    cardButton.setAttribute('data-toggle', 'modal')
    cardButton.setAttribute('data-target', '#'+modalId)
    cardBody.classList.add('card-body')
    parentCard.appendChild(cardTitle)
    cardBody.appendChild(bodyContent)
    cardBody.appendChild(cardButton)
    parentCard.appendChild(cardBody)
    return parentCard
}

const generateModalDOM = (reviews, modalId, courseName)=>{
    let parentModal = document.createElement('div')
    parentModal.classList.add('modal', 'fade', 'position')
    parentModal.id = modalId
    let modalDialog = document.createElement('div')
    modalDialog.classList.add('modal-dialog')
    let modalContent = document.createElement('div')
    modalContent.classList.add('modal-content')
    let modalHeader = document.createElement('div')
    let modalTitle = document.createElement('h5')
    modalTitle.classList.add('modal-title')
    modalTitle.textContent = 'Reviews for '+courseName
    modalHeader.classList.add('modal-header')
    modalHeader.appendChild(modalTitle)
    let modalBody = document.createElement('div')
    modalBody.classList.add('modal-body')
    let modalFooter = document.createElement('div')
    modalFooter.classList.add('modal-footer')
    modalContent.appendChild(modalHeader)
    modalContent.appendChild(modalBody)
    modalContent.appendChild(modalFooter)
    modalDialog.appendChild(modalContent)
    parentModal.appendChild(modalDialog)
    return parentModal
}

let courses = getData('Courses')
randomThree(courses)

const generateFeaturedCourses = (featuredCourses, generateModal)=>{
    document.querySelector('#featured-courses-body').innerHTML = ''
    featuredCourses.forEach((course)=>{
        let ID = Math.random().toString(36).substr(2, 9)
        let rateBody = document.createElement('p')
        rateBody.textContent = 'Homework load: '
        rateBody.appendChild(returnStringRes(course, 'hw'))
        let diffBody = document.createElement('p')
        diffBody.textContent = 'Course difficulty: '
        diffBody.appendChild(returnStringRes(course, 'diff'))
        let timeBody = document.createElement('p')
        timeBody.textContent = 'Time committment: '
        timeBody.appendChild(returnStringRes(course,'time'))
        let overallBody = document.createElement('div')
        overallBody.classList.add('float-left')
        overallBody.appendChild(rateBody)
        overallBody.appendChild(diffBody)
        overallBody.appendChild(timeBody)
        if(generateModal){
            document.querySelector('#featured-courses-body').appendChild(generateCardDOM(course.courseName, overallBody, ID))
            document.querySelector('body').appendChild(generateModalDOM([], ID, course.courseName))
        } else {
            document.querySelector('#featured-courses-body').appendChild(generateCardDOM(course.courseName, overallBody, ID))
        }
    })
}

let featuredCourses = getData('featuredCourses')

if(sessionStorage.getItem('isLoggedIn') === null){
    document.querySelector('#review-body').innerHTML = ''
    document.querySelector('body').innerHTML = ''
    let errorEl = document.createElement('p')
    errorEl.textContent = 'Please sign in or sign up.'
    document.querySelector('body').appendChild(errorEl)
} else {
    generateFeaturedCourses(featuredCourses, true)
}

document.querySelector('#review-body').addEventListener('input', ()=>{
    if(document.querySelector('#review-body').value.length > 150){
        document.querySelector('#review-body').value = document.querySelector('#review-body').value.substring(0, 100)
    }  
    document.querySelector('#word-count').textContent = document.querySelector('#review-body').value.length + '/100'
})

const calculateAvg = (newValue, query, valueQuery)=>{
    let courseData = getData('Reviews')
    let specificCourses = courseData.filter(review => review.courseName === query)
    let totalNumber = specificCourses.length
    let numSum = 0
    specificCourses.forEach((course)=>{
        numSum += Number(eval('course.'+valueQuery))
    })
    return Math.round((numSum/totalNumber) * 10) / 10
}

document.querySelector('#post-review').addEventListener('submit', (e)=>{
    e.preventDefault()
    let courseNameValue = document.querySelector('#course-name').value
    let reviewBody = document.querySelector('#review-body').value
    let courseDifficultyValue = document.querySelector('#course-difficulty').value
    let homeworkLoadValue = document.querySelector('#homework-load').value
    let timeCommittmentValue = document.querySelector('#time-committment').value
    let posterInfo = {
        email: sessionStorage.getItem('currentEmail'),
        grade: sessionStorage.getItem('currentGrade')
    }
    let today = new Date();
    let datePosted = `${today.getFullYear()}-${(today.getMonth()+1)}-${today.getDate()}`;
    let newData = getData('Reviews')
    let newReview = {
        courseName: courseNameValue,
        review: reviewBody,
        courseDifficulty: courseDifficultyValue,
        homeworkLoad: homeworkLoadValue,
        timeCommittment: timeCommittmentValue,
        posterInfo: posterInfo,
        datePosted: datePosted 
    }
    newData.push(newReview)
    localStorage.setItem('Reviews', JSON.stringify(newData))
    let validatedCourses = getData('Courses')
    let courseAttributes = {
        courseName: courseNameValue,
        avgHwLoad: calculateAvg(homeworkLoadValue, courseNameValue, 'homeworkLoad'),
        avgDifficulty: calculateAvg(courseDifficultyValue, courseNameValue, 'courseDifficulty'),
        avgTime: calculateAvg(timeCommittmentValue, courseNameValue, 'timeCommittment')
    }
    let index = validatedCourses.findIndex((course)=>{
        return course.courseName === courseNameValue
    })
    if(index > -1){
        validatedCourses[index] = courseAttributes
    } else {
        validatedCourses.push(courseAttributes)
    }
    localStorage.setItem('Courses', JSON.stringify(validatedCourses))
    courses = getData('Courses')
    randomThree(courses)
    featuredCourses = getData('featuredCourses')
    generateFeaturedCourses(featuredCourses, false)
})  

const processStrings = (word)=>{
    return word.trim().toLowerCase().replace(/\s+/g, "")
}

const detectSort = (arry)=>{
    for(let i = 0; i < arry.length; i++){
        for(let j = i+1; j < arry.length; j++){
            if(arry[i] < arry[j]){
                continue
            } else {
                return false
            }
        }
    }
    return true
}

const convertToArry = (str)=>{
    let arry = []
    for(let i = 0; i < str.length; i++){
        arry.push(str[i])
    }
    return arry
}

const nlp = (word, phrase)=>{
    let processedWord = processStrings(word)
    let processedPhrase = processStrings(phrase)
    let arryPhrase = convertToArry(processedPhrase)
    let comparisonArry = []
    for(let i = 0; i < processedWord.length; i++){
        comparisonArry.push(arryPhrase.indexOf(processedWord[i]))
        arryPhrase.splice(arryPhrase.indexOf(processedWord[i]), 1, " ")
    }
    return detectSort(comparisonArry)
}

const allCourses = getData('Courses')
const searchField = document.querySelector('#course-search')

searchField.addEventListener('input', (e)=>{
    if(searchField.value.length > 0){
        let recommendations = allCourses.filter((course)=>{
            return nlp(searchField.value, course.courseName)
        })
        document.querySelector('#main-body').style.display = 'none'
        document.querySelector('#recommendations').innerHTML = ''
        recommendations.forEach((rCourse)=>{
            let ID = Math.random().toString(36).substr(2, 9)
            let rateBody = document.createElement('p')
            rateBody.textContent = 'Homework load: '
            rateBody.appendChild(returnStringRes(rCourse, 'hw'))
            let diffBody = document.createElement('p')
            diffBody.textContent = 'Course difficulty: '
            diffBody.appendChild(returnStringRes(rCourse, 'diff'))
            let timeBody = document.createElement('p')
            timeBody.textContent = 'Time committment: '
            timeBody.appendChild(returnStringRes(rCourse,'time'))
            let overallBody = document.createElement('div')
            overallBody.classList.add('float-left')
            overallBody.appendChild(rateBody)
            overallBody.appendChild(diffBody)
            overallBody.appendChild(timeBody)
            document.querySelector('#recommendations').appendChild(generateCardDOM(rCourse.courseName, overallBody, ID))
        })
    } else {
        document.querySelector('#recommendations').innerHTML = ''
        document.querySelector('#main-body').style.display = 'block' 
    }
})