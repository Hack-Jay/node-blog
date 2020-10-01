const { exec } = require("../db/mysql");

class Blog {
	constructor() {}

	getList(author, keywords) {
		let sql = `select * from blogs where 1=1 `;
		if (author) {
			sql += `and author='${author}'`;
		}
		if (keywords) {
			sql += `and title like '%${keywords}%'`;
		}
		sql += `order by createtime desc;`;
		return exec(sql);
	}

	getDetail(id) {
		let sql = `select * from blogs where id = ${id}`;
		return exec(sql);
	}

	newBlog(data) {
		const { title, content, author } = data;
		const createtime = Date.now();
		if (title && content && author) {
			let sql = `insert into blogs (title, content, createtime, author) values ('${title}', '${content}', ${createtime}, '${author}');`;
			return exec(sql);
		}
	}

	updateBlog(id, data) {
		const { title, content } = data;
		const createtime = Date.now();
		let sql = `update blogs set title='${title}', content='${content}' where id = '${id}';`;
		return exec(sql);
	}

	delBlog(id, author) {
		let sql = `delete from blogs where id='${id}' and author = '${author}'`;
		return exec(sql);
	}
}

module.exports = new Blog();
