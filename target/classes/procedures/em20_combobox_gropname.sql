CREATE OR REPLACE FUNCTION audit.em20_combobox_groupname()
 RETURNS refcursor
 LANGUAGE plpgsql
AS $$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
	 OPEN po_cursor FOR
		SELECT gp.i_group_id, gp.c_group_name
		FROM group_profile gp
		JOIN user_profile us
			ON gp.i_group_id = us.i_group_id
		JOIN config_auto_report crp
			ON crp.i_user_id = us.i_user_id
		GROUP BY gp.i_group_id
		ORDER BY ASCII(gp.c_group_name);
     RETURN po_cursor;
END 
$$