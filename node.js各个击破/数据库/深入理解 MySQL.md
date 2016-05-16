## 深入理解MySQL

1. 核心模块
	 
	 服务器初始化模块
	 	
	 	当通过命令行启动服务器时，初始化模块接过控制权。
	 	负责解析配置文件，命令行参数，分配全局存储缓冲区，初始化全局变量和结构，加载访问控制表，以及执行大量其他初始化任务。
	 	**  sql/mysqld.cc
	 	init_common_variables()
	 	init_thread_environment()
	 	init_server_components()
	 	grant_init()    : sql/sql_acl.cc
	 	init_slave()    : sql/slave.cc
	 	get_options()
	 	**
	 	
	 		
	 连接管理器
	 
	 	侦听来自回路中的客户端连接，当有客户端连接数据库服务器时，连接管理器执行大量低层次网络协议任务，将控制权传递给线程管理器。
	 	** sql/mysqld.cc
	 	handle_connections_sockets()
	 	**
	 	
	 线程管理器
	 
	 	为客户端连接分配一个线程，用于处理连接。该线程可重新创建，也可从线程高速缓存中提取并被调用。
	 	** sql/mysqld.cc
	 	create_new_thread()
	 	start_cached_thread()
	 	**
	 		 	
	 连接线程	 
	 
	 	它是在一个已建立的连接上处理客户端请求的工作核心。
	 	首先调用用户验证模块，用户通过验证后，客户端可发出请求。
	 	** sql/sql_parse.cc
	 	handle_one_connection()
	 	**
	 	
	 用户验证模块
	 
	 	它负责验证所连接的用户，并对包含该用户层权限信息的结构和变量进行初始化。
	 	** sql/sql_parse.cc
	 	check_connection()
	 	acl_check_host()   : sql/sql_acl.cc
	 	create_random_string()  : sql/password.cc
	 	check_user()
	 	acl_getroot()      : sql/sql_acl.cc
	 	**
	 	  	
	 解析器
	 
	 	解析查询并生成解析树。客户端请求分为查询(query)和命令(command)。查询请求(select, delete, insert...)必须通过解析器。
	 	** sql/sql_parse.cc
	 	mysql_parse()
	 	yyparse()   : sql/sql_yacc.cc
	 	**
	 	
	 命令调度器
	 
	 	将请求转发给知道如何处理这些请求的较低层次模块
	 	** sql/sql_parse.cc
	 	do_command()
	 	dispatch_command()
	 	**
	 		 	
	 查询高速缓存模块
	 
	 	负责将查询发送给解析器。该模块会检查查询是否是可高速缓存的类型，并检查是否存在一个仍然有效／以前计算出的高速缓存结果。找到则返回缓存结果，没有则将查询发送给缓存器。
	 	** sql/sql_cache.cc
	 	Query_cache::store_query()
	 	Query_cache::send_result_to_client()
	 	**	
	 
	 	 
***

	访问控制模块
	 
		该模块验证客户端用户是否具有足够的权限来执行操作，传递成功后再传递给表管理器
		
		** sql/sql_acl.cc
			check_grant()
			check_table_access()  : sql/sql_parse.cc
			check_grant_column()
			acl_get()
		**

***

	优化器
		创建回答查询的最佳策略，并执行策略，向客户端提交结果。
		** sql/sql_select.cc
		mysql_select()
		JOIN::prepare()
		JOIN::optimize()
		JOIN::exec()
		make_join_statistics()
		find_best_combination()
		optimize_cond()
		**
		
		范围优化器，对带有数值范围的查询进行优化
		** sql/opt_range.cc
		SQL_SELECT::test_quick_select()
		**
	 	
	表管理器
	
		负责创建／读取和修改表定义文件(.frm)，维护表描述符高速缓存，管理表锁
		**
		openfrm()             : sql/table.cc
		mysql_create_frm()    : sql/unireg.cc
		open_table()          : sql/sql_base.cc
		open_tables()         : sql/sql_base.cc
		open_ltable()         : sql/sql_base.cc
		mysql_lock_table()    : sql/lock.cc
		**
		
	表修改模块
	 
		负责表创建，删除，重命名，移除，更新或插入之类的操作。
	 	**
	 	mysql_update() 和 mysql_multi_update() : sql/sql_update.cc
	 	mysql_insert() : sql/sql_insert.cc
	 	mysql_delete() : sql/sql_delete.cc
	 	mysql_create_table() : sql/sql_table.cc
	 	mysql_alter_table()
	 	mysql_rm_table()
	 	
	 	**
	 	
	表维护模块
	 
		负责表维护操作，如检查，维修，备份，恢复，优化(碎片整理)及解析
		** sql/sql_table.cc
		mysql_admin_table()
		mysql_check_table()
		mysql_repair_table()
		mysql_backup_table()
		mysql_restore_table()
		mysql_optimize_table()
		mysql_analyze_table()
		**
	 	
	状态报告模块
	 
	 	负责回答关于服务器配置设置，性能追踪变量，表结构信息，复制进度，表高速缓存状况等的查询。
	 	** sql/sql_show.cc
	 	mysqld_list_processes()
	 	mysqld_show()
	 	mysqld_show_create()
	 	mysqld_show_fields()
	 	mysqld_show_open_tables()
	 	mysqld_show_warnings()
	 	show_master_info()  : sql/slave.cc
	 	show_binlog_info()  : sql/sql_repl.cc
	 	**
	 	
	主复制服务器模块
		负责实现主服务器上的复制功能，该模块的最常用功能是根据请求不断向服务器发送复制日志事件。
		** sql/sql_repl.cc
		mysql_binlog_send()
		**
	 
	从复制服务器模块
	 
		负责实现从服务器的复制功能。从服务器任务是从主服务器检索更新，并将更新应用到从服务器上
	 	** sql/slave.cc
	 	handle_slave_io()
	 	handle_slave_sql()
	 	
	 	**
	
***
	 	
	 抽象存储引擎接口(表处理器)
	 
	 	它提供了执行低层次存储与检索操作的标准化接口。
	 	** sql/handler.cc
	 	handler抽象类
	 	handlerton结构
	 	**
	 		 
	 存储引擎实现(MyISAM, InnoDB, MEMORY, Berkeley DB)
	 
	 	每个存储引擎都扩展handler类提供的标准接口。
	 	**
	 	sql/ha_myisam.cc
	 	sql/ha_innodb.cc
	 	sql/ha_deap.cc
	 	sql/ha_ndbcluster.cc
	 	myisam/
	 	innobase/
	 	heap/
	 	ndb/
	 	**
	 
	 日志记录模块
	 
	 	负责维护较高层次的(逻辑)日志，如二进制更新日志，命令日志，缓慢查询日志。
	 	**	
	 	sql/sql_class.cc
	 	sql/log_event.cc  二进制复制日志的日志事件
	 	**
	 	
	 
	 客户端/服务器通信协议API
	 
	 	实现在整个服务器中使用的 API, 以创建，读取，解释和发送协议包。
	 	**
	 	my_net_read()    : sql/net_serv.cc
	 	my_net_write()
	 	net_store_data() : sql/protocol.cc
	 	send_ok()
	 	send_error()
	 	**
	 低层次网络I/O API
	 
	 	 提供低层次网络 I/O和SSL会话的抽象
	 	 **
	 	 vio/目录下，本模块所有函数以vio_开头
	 	 ** 
	 	
	 核心API
	 
	 	该模块提供了丰富的功能集，包括文件I/O,内存管理，字符串操作， 文件系统导航，格式化打印，各种数据结构和算法的实现等
	 	**
	 	mysys/和 strings/目录下，许多核心API函数以my_开头
	 	**
	
2. 编译 mysql源代码
	
	准备工作:
		
		环境具有shell命令：/bin/sh
		

3. xx
