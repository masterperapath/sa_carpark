CREATE OR REPLACE FUNCTION audit.em10_select_group(pi_groupname VARCHAR,pi_groupid VARCHAR)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
    OPEN po_cursor FOR
		SELECT COALESCE(c_comment, '-') AS c_comment , c_group_name, i_group_id, LPAD(i_group_id::VARCHAR, 7, '0') AS groupidLPAD
		FROM group_profile
      	WHERE LOWER(c_group_name) LIKE '%'||COALESCE(LOWER(pi_groupname),'')||'%'
      	AND i_group_id::VARCHAR LIKE COALESCE(pi_groupid, '%');
  RETURN po_cursor;
END
$$
