const fs = require('fs');
const axios = require("axios");

let addCube = async (username, cube) => {
    // call /add-cube for server
    try {
        let res1 = await axios.post("https://d9d2270c.ngrok.io/api/add-cube", {
            username,
            cube
        });
        if (res1.data.result) {
            return (await axios.post("https://d9d2270c.ngrok.io/api/add-cube-init", {
                username,
                cube
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
    const cube = JSON.parse(fs.readFileSync(process.env.NODE_CUBE, 'utf8')).commits[0].message.split(".")[0];
    const userInfo = JSON.parse(fs.readFileSync(`.cubie/cube.json`, 'utf8')).user;
    return await addCube(userInfo.username, cube)
}

wsOnPush().then((res) => {
    console.log(res)
})
