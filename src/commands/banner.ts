import command from '../../config.json' assert {type: 'json'};
import { t } from '../translations';

export const createBanner = () : string[] => {
  const banner : string[] = [];
  banner.push("<br>")
  command.ascii.forEach((ele) => {
    let bannerString = "";
    //this is for the ascii art
    for (let i = 0; i < ele.length; i++) {
      if (ele[i] === " ") {
        bannerString += "&nbsp;";
      } else {
        bannerString += ele[i];
      }
    }
    
    let eleToPush = `<pre>${bannerString}</pre>`;
    banner.push(eleToPush);
  });  
  banner.push("<br>");
  banner.push(t().banner.welcome);
  banner.push(t().banner.typeHelp);
  banner.push("<br>");
  return banner;
}

export const BANNER = createBanner();
