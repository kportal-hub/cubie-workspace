const axios = require("axios");
const fs = require('fs');

let buildCube = async (username, cube, lessons) => {
    try {
        let res1 = await axios.post("https://d9d2270c.ngrok.io/api/build-cube", {
            username,
            cube
        });
        if (res1.data.result) {
            return (await axios.post("https://d9d2270c.ngrok.io/api/build-cube-init", {
                username,
                cube,
                lessons
            })).data
        }
    } catch (err) {
        return {
            result: false,
            error: err.message
        }
    }

}

const wsOnPush = async () => {
    const cube = JSON.parse(fs.readFileSync(process.env.cube, 'utf8')).commits[0].message.split(".")[0];
    const userInfo = JSON.parse(fs.readFileSync(`.cubie/cube.json`, 'utf8')).user;
    const lessons = JSON.parse(fs.readFileSync(`builds/${cube}.cube.json`, 'utf8')).lessons;
    return await buildCube(userInfo.username, cube, lessons)
}

wsOnPush().then((res) => {
    console.log(res)
})
