var push = require('./lib/routes/push')

module.exports = function(app) {
    app.get('/v1/test/push', (req, res) => {
        push.dataChangedPush({
            type: 'get',
            sceneId: req.params.sceneId
        }, (e, r) => { console.log(e, r)})
        res.send()
    })

    app.post('/v1/test/push', (req, res) => {
        push.dataChangedPush({
            type: 'created',
            sceneId: 'asd',
            taskId: 'asd'
        }, (e, r) => { console.log(e, r)})        
        res.send()
    })

    app.put('/v1/test/push', (req, res) => {
        push.dataChangedPush({
            type: 'updated',
            taskId: 'asd'
        }, (e, r) => { console.log(e, r)})
        res.send()
    })

    app.delete('/v1/test/push', (req, res) => {
        push.dataChangedPush({
            type: 'deleted',
            taskId: 'asd'
        }, (e, r) => { console.log(e, r)})        
        res.send()
    })
}