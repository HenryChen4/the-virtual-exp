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
                return generateColorText('text-primary', 'None')
            } else if(avgRate <= 2){
                return generateColorText('text-info', 'Quick and easy')
            } else if(avgRate <= 3){
                return generateColorText('text-success', 'Moderate')
            } else if(avgRate <= 4){
                return generateColorText('text-warning', 'Quite a bit')
            } else if(avgRate <= 5){
                return generateColorText('text-danger', 'Impossible to complete in under 2 hours')
            }
            break
        case 'diff':
            avgRate = course.avgDifficulty
            if(avgRate <= 1){
                return generateColorText('text-primary', 'Tests are too easy')
            } else if(avgRate <= 2){
                return generateColorText('text-info', 'Tests have very few curve ball questions')
            } else if(avgRate <= 3){
                return generateColorText('text-success', 'Tests have a few weird questions')
            } else if(avgRate <= 4){
                return generateColorText('text-warning', 'Tests are full of hard questions')
            } else if(avgRate <= 5){
                return generateColorText('text-danger', 'Tests are hard to ace even if you studied')
            }
            break
        case 'time':
            avgRate = course.avgTime
            if(avgRate <= 1){
                return generateColorText('text-primary', 'No time out of school')
            } else if(avgRate <= 2){
                return generateColorText('text-info', 'Less than an hour')
            } else if(avgRate <= 3){
                return generateColorText('text-success', 'Around an hour')
            } else if(avgRate <= 4){
                return generateColorText('text-warning', 'Big chunk of your time outta school')
            } else if(avgRate <= 5){
                return generateColorText('text-danger', 'Will make you stay up past midnight')
            }
            break
    }
}

const generateCardDOM = (title, bodyContent, modalId)=>{
    let parentCard = document.createElement('div')
    parentCard.classList.add('card', 'mb-3', 'custom-card')
    parentCard.setAttribute('data-toggle', 'modal')
    parentCard.setAttribute('data-target', '#'+modalId)
    let cardTitle = document.createElement('h5')
    cardTitle.classList.add('card-header')
    cardTitle.textContent = title
    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    parentCard.appendChild(cardTitle)
    cardBody.appendChild(bodyContent)
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

const generateFeaturedCourses = (featuredCourses)=>{
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
        overallBody.appendChild(rateBody)
        overallBody.appendChild(diffBody)
        overallBody.appendChild(timeBody)
        document.querySelector('#featured-courses-body').appendChild(generateCardDOM(course.courseName, overallBody, ID))
        document.querySelector('body').appendChild(generateModalDOM([], ID, course.courseName))
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
    generateFeaturedCourses(featuredCourses)
}

document.querySelector('#review-body').addEventListener('input', ()=>{
    if(document.querySelector('#review-body').value.length > 100){
        document.querySelector('#review-body').value.substring(101, 1)
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
    generateFeaturedCourses(featuredCourses)
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

const nlp = (word, phrase, compareCallback)=>{
    let processedWord = processStrings(word)
    let processedPhrase = processStrings(phrase)
    let arryPhrase = convertToArry(processedPhrase)
    let comparisonArry = []
    for(let i = 0; i < processedWord.length; i++){
        comparisonArry.push(arryPhrase.indexOf(processedWord[i]))
        arryPhrase.splice(arryPhrase.indexOf(processedWord[i]), 1, " ")
    }
    return compareCallback(comparisonArry)
}

