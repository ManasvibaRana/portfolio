import { MODE_KEY, THEME_KEY } from "./storageKeys";

/**
 * Runs inline in <head> before first paint:
 * - picks the mode: ?mode= query > saved choice > Recruiter for crawlers,
 *   weak devices or no WebGL > 3D studio
 * - applies the saved theme; otherwise the 3D room matches the visitor's
 *   local time (night after 8 pm) and Recruiter mode follows the system theme
 */
export const bootScript = `(function(){try{
var d=document.documentElement,n=navigator,q=new URLSearchParams(location.search).get("mode");
if(q!=="3d"&&q!=="recruiter")q=null;
var saved=null;try{saved=localStorage.getItem("${MODE_KEY}");if(q)localStorage.setItem("${MODE_KEY}",q);}catch(e){}
var mode=q||saved;
if(mode!=="3d"&&mode!=="recruiter"){
var bot=/bot|crawl|spider|slurp|lighthouse|headless/i.test(n.userAgent);
var c=document.createElement("canvas"),gl=null;try{gl=c.getContext("webgl2")||c.getContext("webgl");}catch(e){}
var weak=!gl||(n.hardwareConcurrency&&n.hardwareConcurrency<=2)||(n.deviceMemory&&n.deviceMemory<=2)||(n.connection&&n.connection.saveData);
mode=bot||weak?"recruiter":"3d";
}
d.dataset.mode=mode;
var t=null;try{t=localStorage.getItem("${THEME_KEY}");}catch(e){}
var h=new Date().getHours(),lateNight=h>=20||h<6;
if(t==="dark"||(!t&&(mode==="3d"?lateNight:matchMedia("(prefers-color-scheme: dark)").matches)))d.classList.add("dark");
}catch(e){document.documentElement.dataset.mode="recruiter";}})();`;
