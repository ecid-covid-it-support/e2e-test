export default Date.prototype.toLocalISOString = function () {
    function pad(number) { return ('' + number).padStart(2, '0') }
    return `${this.getFullYear()}-${pad(this.getMonth() + 1)}-${pad(this.getDate())}T${pad(this.getHours())}:${pad(this.getMinutes())}:${pad(this.getSeconds())}.${pad(this.getTimezoneOffset())}Z`
}