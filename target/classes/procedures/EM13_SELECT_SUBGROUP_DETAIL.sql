CREATE OR REPLACE FUNCTION audit.em13_select_subgroup_detail(pi_subgroup_id character varying, pi_group_id character varying, pi_username character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
declare
  po_cursor                   REFCURSOR;
BEGIN
	 OPEN po_cursor FOR
	 SELECT grp.c_group_name, usr.c_username, sub.i_mid_id, sub.i_group_id, sub.i_subgrp_id, COALESCE(box.c_plate_number,'-') AS c_plate_number
		FROM user_profile usr 
			JOIN group_profile grp ON grp.i_group_id = usr.i_group_id
			LEFT JOIN subgrp_mid_relate sub ON sub.i_subgrp_id = usr.i_subgrp_id
			LEFT JOIN box_profile box ON box.i_mid_id = sub.i_mid_id
		WHERE usr.i_subgrp_id != 0
			AND sub.i_group_id = pi_group_id::NUMERIC
			AND sub.i_subgrp_id = pi_subgroup_id::NUMERIC
			AND usr.c_username = pi_username;
    
  RETURN po_cursor;
END
$function$
