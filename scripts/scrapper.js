const request = require("request");
const cheerio = require("cheerio");

function find_teacher_page(args,callback){

    let nameSpecified;
    let lessonCode;
    let teacherName;

    if (args.length === 1){
        nameSpecified = false;
        lessonCode = args[0].substring(0,3) + " " + args[0].substring(3,args[0].length);
        teacherName = "unnamed";
    } else {
        nameSpecified = true;
        lessonCode = args[0].substring(0,3) + " " + args[0].substring(3,args[0].length);
       args.shift();
        teacherName = args.join(" "); 
    }

    let url = "https://itutakipci.com";
    let query = lessonCode.replace(" ","+").toUpperCase();
    let url_query = url + "/?q=" + query;
    
    request(url_query,(error,response,html) => {
        try{
            if(!error && response.statusCode === 200){
                const $ = cheerio.load(html);
    
                let td_s = $(".container")
                .find(".col-md-9")
                .children().first() // table
                .children().last() // tbody
                .children("tr")
                .children("td")

                let teachers = [];

                td_s.each((index, td) =>{
                    if ((index % 3) === 0){
                        let tLink = td.children[0].attribs.href;
                        let tName = td.children[0].children[0].data.trim();
                        if (nameSpecified){
                            if (tName.toLowerCase().includes(teacherName.toLowerCase())){
                                tName = tName.split(/[\.\(\)]+/).slice(-1)[0].trim();
                                teachers.push({
                                    teacherName: tName,
                                    lessonCode: lessonCode.toUpperCase(),
                                    teacherLink: (url + tLink)
                                });
                            }
                        } else {
                            tName = tName.split(/[\.\(\)]+/).slice(-1)[0].trim();
                            teachers.push({
                                teacherName: tName,
                                lessonCode: lessonCode.toUpperCase(),
                                teacherLink: (url + tLink),
                            });
                        }
                    }
                })
                return callback(teachers);
            } else {
                throw error;
            }
        } catch(err) {
            console.log(err);
            return false;
        }
    })
   
}

function setInfo(teacherLink,lessonCode,callbackTwo){

    const url_template = "https://itutakipci.com"

    lessonCode = (lessonCode.trim().split(/ +/)).join("").toUpperCase();

    request(teacherLink,(error,response,html) => {
        try{
            if (!error && response.statusCode === 200){
                const $ = cheerio.load(html);
        
                let lesson_general = $(".container-fluid")
                .children(".row")
                .find("#tab1primary")
                .children();
        
                let lesson_content = [];
                        
                lesson_general.each((i, el) => {
                    if (i >= 3 && el.attribs.class.endsWith(lessonCode)){
                                
                        const mediaUrlParent = $(el)
                        .find(".thumbnail2");

                        const imageHeader = mediaUrlParent.attr("data-title").split(/ +\| +/);
                        const mediaUrl = url_template + mediaUrlParent.attr("data-image");
                        const content = {
                            teacherName: imageHeader[0],
                            lessonCode: imageHeader[1],
                            lessonSeason: imageHeader[2]
                        };
        
                        lesson_content.push({teacherLink,
                            teacherName: content.teacherName,
                            lessonCode: content.lessonCode.split(/ +/).join(""),
                            lessonSeason: content.lessonSeason,
                            mediaUrl});
        
                    }
                })
        
                let result = lesson_content;        
                return callbackTwo(result);
            
            } else {
                throw error;
            }
        
        } catch(error) {
            console.log(error);
            return false;
        }
    });  
}

module.exports = {
    findTeacherPage: find_teacher_page,
    setInfo: setInfo
};