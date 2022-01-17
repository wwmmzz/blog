// 简单实现 validate-npm-package-name

// 验证字符串是否符合npm包名规范 GitHub地址：https://github.com/npm/validate-npm-package-name

// 包名长度应大于零
// 包名中的所有字符都必须是小写的，即不允许大写或混合大小写的名称
// 包名可以包含连字符
// 包名称不得包含任何非 url 安全字符（因为名称最终成为 URL 的一部分）
// 包名不应以 .或者 _
// 包名不应包含任何前导或尾随空格
// 包名不应包含以下任何字符：~)('!*
// 包名称不能与 node.js/io.js 核心模块或保留/黑名单名称相同。
// 包名长度不能超过214

const required = [
    (p)=>!p,
    {
        warnings:[],
        errors:['name length must be greater than zero']   
    }
]

const noUppercase = [
    (p)=>p.split('').some(s=>/[A-Z]/.test(s)),
    {
        warnings:['name can no longer contain capital letters'],
        errors:[]
    }
]

const noNonUrlSafeCharacters = [
    (p)=>encodeURIComponent(p).length>p.length,
    {
        warnings:[],
        errors:['name can only contain URL-friendly characters'] 
    }
]

const noStartWithCharacters = [
    (p)=>(p.charAt(0)==='_')||(p.charAt(0)==='.'),
    {
        warnings:[],
        errors:[] 
    }
]

const noInBlackList = [
    (p)=>[].includes(p),
    {
        warnings:[],
        errors:[]  
    }
]

const noStartOrEndSpace = [
    (p)=>p.trim().length<p.length,
    {
        warnings:[],
        errors:[]  
    }
]

const noSpaiceChars = [
    (p)=>/[\~\)\('!\*]/.test(p),
    {
        warnings:['name can no longer contain special characters ("~\'!()*")'],
        errors:[]  
    }
]

const noGreaterThan124 = [
    (p)=>p.length>124,
    {
        warnings:['name can no longer contain more than 214 characters'],
        errors:[]  
    }
]

const rules = new Map([
    required,
    noUppercase,
    noNonUrlSafeCharacters,
    noStartWithCharacters,
    noStartOrEndSpace,
    noSpaiceChars,
    noInBlackList,
    noGreaterThan124
])



export default validate  = (packagename)=>{
    let validForNewPackages = true,validForOldPackages = true,warnings=[],errors=[]
    if (packagename === null) {
        validForNewPackages = false
        validForOldPackages = false
        errors.push('name cannot be null')
        return {
            validForNewPackages,
            validForOldPackages,
            errors
        }
      }
    
      if (packagename === undefined) {
        validForNewPackages = false
        validForOldPackages = false
        errors.push('name cannot be undefined')
        return {
            validForNewPackages,
            validForOldPackages,
            errors
        }
      }
    
      if (typeof packagename !== 'string') {
        errors.push('name must be a string')
        return {
            validForNewPackages,
            validForOldPackages,
            errors
        }
      }
    rules.forEach((v,k)=>{
       if(k(packagename)){
        validForNewPackages = false
        validForOldPackages = false
        warnings.concat(v.warnings)
        errors.concat(v.errors)
       }
    })

    const message = ()=>{
        let res = {}
        if(warnings.length){
            res.warnings = warnings
        }
        if(errors.length){
            res.errors = errors
        }

        return res
    }

    return {
        validForNewPackages,
        validForOldPackages,
       ...message()
    }
}