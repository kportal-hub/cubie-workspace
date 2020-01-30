class Branch {
    constructor(topic, lessons) {
        this.topic = this.key = topic
        this.lessons = lessons

        this.points = this.passed = this.total = this.failed = this.performace = 0;
        
        for (let [key, value] of Object.entries(this.lessons)) {
            this.passed += value.test.passed
            this.failed += value.test.failed
            // this.passed += value.test.status === "passed" ? 1 : 0
            // this.failed += value.test.status === "failed" ? 1 : 0
            // this.pending += value.test.status === "pending" ? 1 : 0
            this.points += value.points || 0
            this.total += value.test.total
        }
        //this.points = this.passed * 1000;
        console.log(this.total)
        this.performace = this.passed / this.total
        this.status = this.passed === this.total




    }
    render() {
        const html =
`<div class = "branch topic">
    <div class = "header ">
        <span class = "text-${this.status ? 'success': 'info'}">${this.status ? '✔' : '⟲'}</span>
        <span class = "key">${this.key}</span>
        <span class = "text-success">${this.passed} ✔</span>
        <span class = "text-danger">${this.failed} ✖</span>
        <span class = "text-info">${this.performace*100}% ❤</span>
        <span class = "text-warning">${this.points} ⦿</span>
    </div>
    <div class = "lessons"></div>
</div>`
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        this.el = wrapper.firstChild;

        this.el.querySelector(".header").onclick = (e) => {
            //console.log(e.target.hash)
            console.log(this.lessons)
            if (!this.lessonsDom){
                this.lessonsDom = {}
                let lessonsWrapper = this.el.querySelector(".lessons")
                for (let [key, value] of Object.entries(this.lessons)) {
                    let w = document.createElement('div');

                    const htmlLesson =
                    `<div class = "lesson">
                        <span class = "text-${value.test.status === "passed" ? 'success': 'info'}">${value.test.status === "passed" ? '✔' : '⟲'}</span>
                        <a href = "" class = "key">${key}</a>
                        <span class = "text-success">${value.test.passed} ✔</span>
                        <span class = "text-danger">${value.test.failed} ✖</span>
                        <span class = "text-info">${(value.test.passed/value.test.total)*100}% ❤</span>
                        <span class = "text-warning">${value.points} ⦿</span>
                    </div>`

                    w.innerHTML = htmlLesson
                    this.lessonsDom[key] = w.firstChild 
                    lessonsWrapper.appendChild(w.firstChild )
                }

            }

            e.preventDefault();
            return false
        }
        return this.el;

    }
}
