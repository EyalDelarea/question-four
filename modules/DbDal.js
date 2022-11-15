const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'db',
  database: 'question_four',
  password: 'postgres',
  port: 5432,
})
client.connect()


async function executeInsertQuery(text,values) {
    try {
        res= await client.query(text, values)
        return res.rows[0]
    } catch (err) {
        console.log(err.stack)
    }
}

const savePizzaReport =async (report,id)=>{
    const text = "\
    INSERT 	INTO\
	pizzas_reports (start_time,end_time,total_duration_seconds,number_of_toppins,main_report_fk)\
    values ($1,$2,$3,$4,$5) "
    const {startTime,endTime,totalTime,numOfTopping} = report
    const values =[startTime,endTime,totalTime,numOfTopping,id]    
    await executeInsertQuery(text,values)
}

const  saveTotalReport = async (totalReport)=>{
    const text = "\
            INSERT INTO\
            public.restaurant_report (start_time,\
            end_time,\
            total_duration_seconds)\
            values ($1,$2,$3) returning id   "
    
    const {start_time,end_time,total_seconds} = totalReport
    const values =[start_time,end_time,total_seconds]
    return await executeInsertQuery(text,values)
}



module.exports = {savePizzaReport,saveTotalReport};