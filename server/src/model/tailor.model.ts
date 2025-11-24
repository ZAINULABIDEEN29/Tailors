import mongoose, {Schema,Document} from "mongoose";
import bcrypt from "bcrypt"

export interface ITailor extends Document{
    _id:mongoose.Types.ObjectId;
    name:string;
    email:string;
    password:string;
    isVerified:boolean;
    verifyCode:string;
    verifyCodeExpire:Date | null;
    refreshToken:string;
    resetPassword:string | null;
    resetPasswordExpire:Date | null;

    
    comparePassword(password:string): Promise<boolean>;
}



const tailorSchema:Schema<ITailor> = new Schema(
    {
        name:{
            type:String,
            required:[true,"name is required"],
            minLength:[2,"atleast 2 characters required"],
            trim:true,
            lowercase:true
        },
        email:{
            type:String,
            required:[true,"email is required"],
            unique:true,
            lowercase:true,
            trim:true,
            match:[
             /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
              "Please enter a valid email address"
        ]
        },
        password:{
            type:String,
            required:[true,"password is required"],
            trim:true,
            minLength:[8,"atleast 8 characters required"]   
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        verifyCode:{
            type:String,
            default:""
        },
        verifyCodeExpire:{
            type:Date,
            default:null
        },
        refreshToken:{
            type:String,
            default:""
        },
        resetPassword:{
            type:String,
            default:null
        },
       resetPasswordExpire: {
            type: Date,
            default: null
        }
    },
    {
        timestamps:true
    }
)

tailorSchema.pre("save", async function(this: ITailor){
    
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10);
})

tailorSchema.methods.comparePassword = async function(this: ITailor, password: string): Promise<boolean>{
    return bcrypt.compare(password, this.password);
}

const Tailor = mongoose.model<ITailor>("Tailor",tailorSchema);

export default Tailor;