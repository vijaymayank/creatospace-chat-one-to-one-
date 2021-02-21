const app = new Vue({
    el: '#app',
    data: {
        title: 'Nestjs Websockets Chat',
        name: '',
        text: '',
        messages: [],
        socket: null,

        userList:[],
        receiverId:'',
       // senderId:this.socket.id


    },
    methods: {
        sendMessage() {
            if(this.validateInput()) {
                const message = {
                    name: this.name,
                    text: this.text,
                    senderId:this.socket.id,
                    receiverId:this.receiverId
                }
 
                // console.log(message.receiverId)
                // console.log(message.text)
                // console.log(message.name)

                this.socket.emit('msgToServer', message)
                this.text = ''
                this.receiverId=''
            }
        },

        receivedMessage(message) {
            this.messages.push(message)
        },

        async receiverIdentifier(event){
             // console.log("receiverfunction")
            // for( i=0;i<this.userList.length;i++)
            // console.log(this.userList[i].name + " "+this.userList[i].id)
            // console.log(event)

            let receiverNameObject=await this.userList.find(user=>user.name===event)
            this.receiverId=receiverNameObject.id
        },
        
        async alert(){
            //console.log("alert reached")
            let username=await prompt("please enter username","")
            if(username!=null)
            {   
                this.name=username
               await this.socket.emit('senderName', username)
            }
           
        },

        validateInput() {
            return this.name.length > 0 && this.text.length > 0
        }

    },

    created() {
        this.socket = io('http://localhost:3000')
        this.alert();

        this.socket.on('msgToClient', (message) => {
            this.receivedMessage(message)
        })

        this.socket.on('updatedList',userList=>{
            this.userList=userList ;
        })
    }
})