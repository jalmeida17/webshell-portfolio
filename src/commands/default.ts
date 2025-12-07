export const createDefault = () : string[] => {
  const defaultMsgArr = [
    "<br>",
    "Command not found.",
    "Type <span class='command'>'help'</span> to see list of available commands.",
    "<br>"
  ]  
  
  const defaultMsg : string[] = [];
  
  defaultMsgArr.forEach((ele) => {
    defaultMsg.push(ele);
  })

  return defaultMsg;
}

export const DEFAULT = createDefault();
