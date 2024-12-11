// const validate = (schema) => async(req,res,next) => {

//     try{

//         const parseBody = await schema.parseAsync(req.body);
//         req.body = parseBody;
//         next();

//     }
//     catch(error){
        
//         console.log(error)
//         res.status(400).json({message: "Validation failed"});
//     }

// }

// module.exports = validate;


// const validate = (schema) => async (req, res, next) => {
//     try {
//       const parseBody = await schema.parseAsync(req.body);
//       req.body = parseBody;
//       next();
//     } catch (err) {
//        const message = err.error[0].message;      
//        console.log(message)
//        res.status(400).json({ message: err.message });
//     }
//   };
  
// module.exports = validate;