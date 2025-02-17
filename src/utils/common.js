import moment from 'moment'
//'DD/MMM/YYYY hh:mm'
const formattedDate=function(v,formatStr){
		if (v) {
			return moment(String(v)).format(formatStr)
		}
}
export default {
	formattedDate
}