let _page = null;
function MakePage() {
    if (_page)
        return _page
    _page = new (class Page {
        constructor() {
            this.user = null;
            this.cubes = {};
            this.branches = []

            window.addEventListener("cube_clicked", e => {
                const cube = this.cubes[e.detail];
                this.branches = []
                for (let [topic, lessons] of Object.entries(this.cubes[cube.name].result)) {
                    let b = new Branch(topic, lessons)
                    // debugger
                    this.branches.push(b)
                    document.querySelector("#cubeDetails").appendChild(b.render())
                }
                // render them in the right and if click get their "resultUrl" and fetch json n show
            })


        }
        async start() {
            let cubeData = await fetch("../.cubie/cube.json?123")
            cubeData = await cubeData.json()
            console.log(cubeData)
            this.points = 0
            for (let [key, value] of Object.entries(cubeData.cubes)) {
                this.cubes[key] = new CubeView(key, value)
                this.points += this.cubes[key].progress.points
            }

            cubeData.user.points = this.points

            this.user = await new UserView(cubeData.user)
            this.render()
            window.dispatchEvent(new CustomEvent("cube_clicked", { detail: "javascript"}))
            return this.cubes
        }
        render() {
            document.querySelector("#user")
                .appendChild(this.user.render())

            for (let cube of Object.values(this.cubes)) {
                document.querySelector("#cubes")
                    .appendChild(cube.render())
            }

        }
        hi() {
            console.log('hi')
        }
    })
    return _page
}
