import postgres from 'postgres';

// Configure postgres client to disable prepared statements
const sql = postgres(process.env.POSTGRES_URL!, { 
  ssl: 'require',
  connect_timeout: 60,  // 60 seconds
  idle_timeout: 60,     // 60 seconds
  max_lifetime: 60 * 5, // 5 minutes
  prepare: false        // Disable prepared statements to avoid FetchPreparedStatement error
});

async function dropAllTables() {
	try {
		// Drop all tables in the correct order (to handle foreign key constraints)
		await sql`DROP TABLE IF EXISTS invoices;`;
		await sql`DROP TABLE IF EXISTS customers;`;
		await sql`DROP TABLE IF EXISTS users;`;
		await sql`DROP TABLE IF EXISTS revenue;`;
		
		return { message: 'All tables dropped successfully. Now you can re-seed the database by visiting /seed' };
	} catch (error) {
		console.error('Error dropping tables:', error);
		throw error;
	}
}

export async function GET() {
  // return Response.json({
  //   message:
  //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
  // });
  try {
  	return Response.json(await dropAllTables());
  } catch (error) {
  	console.error('Query error:', error);
  	return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
