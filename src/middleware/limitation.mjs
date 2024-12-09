import { getError } from "../errors/error.mjs";

const userRequest={};

export function limitRate(){
  return(req,res,next)=>{
    const {USER_LIMIT,USER_TIME_WINDOW}=process.env;
    const{role,username}=req;
    if(role=="ADMIN"){
        throw getError(403,"");
    }else if(role=="USER"){
        limitUserRequest(username,USER_LIMIT,USER_TIME_WINDOW);
    }else{
        next();
    }
    next();
  } 
   
}
const limitUserRequest = (username, limit, timeWindow) => {
    const now = Date.now();
    const requestTimes = userRequest[username] || [];
    const filteredTimes = requestTimes.filter(time => now - time <= timeWindow*1000);
    userRequest[username] = filteredTimes;
    if (filteredTimes.length > limit) {
        throw getError(429, "");
    }
    filteredTimes.push(now);
   
};