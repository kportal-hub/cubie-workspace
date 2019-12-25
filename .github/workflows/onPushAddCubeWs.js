const axios = require("axios")
const shell = require("shelljs")
const crypto = require('crypto');

async function encryptAndPutAuthFile(username, repo, algorithm, gitToken, requestType, silent) {
    try {
        var cipher = crypto.createCipher(algorithm, gitToken);
        var encryptedPhrase = cipher.update(requestType, 'utf8', 'hex');
        encryptedPhrase += cipher.final('hex');
        shell.exec(`git checkout master`, {silent});
        shell.exec(`echo ${encryptedPhrase} > ${requestType}.req`, {silent});
        shell.exec(`git add ${requestType}.req`, {silent});
        shell.exec(`git commit -m 'add request file'`, {silent});
        shell.exec(`git push https://${username}:${gitToken}@github.com/${repo} master`, {silent});
        return true
    } catch (err) {
        throw err
    }
}

async function removeAuthFiles(username, repo, gitToken, silent) {
    try {
        shell.exec(`git checkout master`, {silent});
        shell.exec(`rm add-cube.req`, {silent});
        shell.exec(`rm add-cube-init.req`, {silent});
        shell.exec(`git add add-cube.req`, {silent});
        shell.exec(`git add add-cube-init.req`, {silent});
        shell.exec(`git commit -m 'remove request files'`, {silent});
        shell.exec(`git push https://${username}:${gitToken}@github.com/${repo} master`, {silent});
        return true
    } catch (err) {
        throw err
    }
}

// actions on push
let addCube = async (username, cube, gitToken, repo) => {
    const algorithm = 'aes256';
    const _silent = false;

    try {
        // create add cube request type file
        await encryptAndPutAuthFile(username, repo.split('/')[1], algorithm, gitToken, "add-cube", _silent);

        let res1 = await axios.post("https://0689c118.ngrok.io/api/add-cube", {
            username,
            cube,
            gitToken,
            repo: repo.split('/')[1]
        });
        if (res1.data.result) {
            // create add cube init request type file
            await encryptAndPutAuthFile(username, repo,split('/')[1], algorithm, gitToken, "add-cube-init", _silent);

            let r =(await axios.post("https://0689c118.ngrok.io/api/add-cube-init", {
                username,
                cube, 
                gitToken,
                repo: repo.split('/')[1]
            })).data;
            
            if (r.result) {
                await removeAuthFiles(username, repo.split('/')[1], gitToken, _silent)
            }
            
            return r;
        }
    } catch (err) {
        return {
            result: false,
            error: "Couldn't add cube: " + err.message
        }
    }

}

const wsOnPush = async (gitToken, repo) => {
    const cube = JSON.parse(fs.readFileSync(process.env.NODE_CUBE, 'utf8')).commits[0].message.split(".")[0];
    const userInfo = JSON.parse(fs.readFileSync(`.cubie/cube.json`, 'utf8')).user;
    return await addCube(userInfo.username, cube, gitToken, repo)
}

wsOnPush(process.argv[2], process.argv[2]).then((res) => {
    console.log(res)
})
