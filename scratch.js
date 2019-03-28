if(typeof VScanAccessIFrame !== 'function'){
    window.VScanAccessIFrame = (iframe) => {
    let html = null;
    try { 
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      html = doc.body.innerHTML;
    } 
    catch(err) {}
    return(html !== null);
    }
}

[...document.querySelectorAll('iframe')].reduce( (a,iframe,index) => {
    console.log(index);
    if(VScanAccessIFrame(iframe)){
        a.push({index,iframe})
        console.log(iframe.contentWindow.document.body.querySelectorAll('video'))
    }
    return a
},[])

document.querySelectorAll('.button-nfplayerFastForward')[0].click()
document.querySelectorAll('.button-nfplayerBackTen')[0].click()

let URL
exec = async (cmd = '') => {
    URL=null
    chrome.tabs.executeScript({ code: 'document.URL' },
        ([result, ...rest]) => {
            console.log('%s:\n::%o', cmd, updateVS(result));
            URL=result;
            setTimeout(() => return result, 1000)
        }
    )
    return URL
}