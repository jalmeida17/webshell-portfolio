import { t } from '../translations';

export const createDefault = () : string[] => {
  const defaultMsgArr = [
    "<br>",
    t().default.notFound,
    t().default.typeHelp,
    "<br>"
  ]  
  
  const defaultMsg : string[] = [];
  
  defaultMsgArr.forEach((ele) => {
    defaultMsg.push(ele);
  })

  return defaultMsg;
}

export const DEFAULT = createDefault();
