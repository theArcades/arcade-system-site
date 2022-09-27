//script to pull simplyplural members and filter private members. If this is a data risk for your system, please see MD for alternative implementation
//parms for simply plural calls. Add these in your process.env file:

const SPtoken = process.env["SPtoken"];
const SPuser = process.env["SPuser"];
const rootURL = "https://v2.apparyllis.com";
const headers = { Authorization: SPtoken, host: "v2.apparyllis.com" };

// given a call URL, call SP and return the json.
//todo rewrite using fetch
function callSP(callURL) {
  var config = {
    method: "get",
    url: callURL,
    headers: headers,
  };

  const promise = axios(config).catch(function (error) {
    console.log(error);
  });

  const promiseData = promise.then((response) => response.data);

  return promiseData || "Something went wrong.";
}

// given SP token and userid, return system data. (This gives us private field names)
async function getSystemData() {
  return callSP("https://v2.apparyllis.com/v1/system/");
}

// return an array of member objects that represents who is fronting
// TODO rewrite with fetch, obvi
async function getFronters() {
  var frontInfo = await callSP("https://v2.apparyllis.com/v1/fronters/?");
  var memberID = frontInfo.map((member) => member.content.member);
  let fronters = await Promise.all(
    memberID.map(async (id) => {
      let member = await callSP(
        "https://v2.apparyllis.com/v1/member/" + SPuser + "/" + id
      );
      //strip some stuff from the result so that we don't reveal too much...
      let result = {
        name: member.content.name,
        desc: member.content.desc,
        avatar: member.content.avatarUrl,
        pronouns: member.content.pronouns,
        info: member.content.info,
        age: member.content.age,
      };
      return result;
    })
  );

  return fronters;
}



// given a SP token and userid, return all members of a system
async function getMembers() {
  var allMembers = await callSP(
    "https://v2.apparyllis.com/v1/members/" + SPuser
  );
  var publicMembers = await allMembers.filter(stripPrivateMembers);
  var customFields = getCustomFields();
  //return sortMembers(publicMembers); //only if we are sorting by site-order

  return allMembers;
}

// given one object from getMembers(), return only public members.
function stripPrivateMembers(member) {
  return member.content.private == false;
}

//given a member object, returns mapping of custom field UID to name.
function getCustomFields(members) {
  return members; //todo - walk array and replace custom uids with actual named field
}

// given a list of members, sort according to site-order (TODO)
function sortMembers(members) {
  return members; //todo - sort logic
}


//construct TOC

//construct a single alter entry

//construct whole site