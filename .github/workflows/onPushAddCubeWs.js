const fs = require('fs');
const axios = require("axios");

let addCube = async (username, cube, gitToken) => {
    // call /add-cube for server
    try {
        let res1 = await axios.post("https://cubie.now.sh/api/add-cube", {
            username,
            cube
        });
        if (res1.data.result) {
            return (await axios.post("https://cubie.now.sh/api/add-cube-init", {
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

const wsOnPush = async (gitToken) => {
    const cube = JSON.parse(fs.readFileSync(process.env.NODE_CUBE, 'utf8')).commits[0].message.split(".")[0];
    const userInfo = JSON.parse(fs.readFileSync(`.cubie/cube.json`, 'utf8')).user;
    return await addCube(userInfo.username, cube, gitToken)
}

wsOnPush(process.argv[2]).then((res) => {
    console.log(res)
})
