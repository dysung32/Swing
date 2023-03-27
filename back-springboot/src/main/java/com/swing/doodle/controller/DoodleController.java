package com.swing.doodle.controller;

import com.swing.doodle.model.dto.CreateRoomDto;
import com.swing.doodle.model.dto.RoomDto;
import com.swing.doodle.model.service.DoodleService;
import com.swing.user.controller.UserController;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"*"}, maxAge = 6000)
@RestController
@RequestMapping("/doodle")
@Api(tags = {"Speedoodle 관리 API"})
public class DoodleController {
	
	@Autowired
	private DoodleService doodleService;
	
	public static final Logger logger = LoggerFactory.getLogger(UserController.class);
	private static final String SUCCESS = "success";
	private static final String FAIL = "fail";
	private static final String ALREADY_EXIST = "already exists";
	
	@ApiOperation(value = "방 생성", notes = "방 생성 API", response = Map.class)
	@PostMapping("/room")
	public ResponseEntity<?> createRoom(
			@RequestBody @ApiParam(value = "방 정보") CreateRoomDto createRoomDto) {
		
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.OK;
		
		// Socket 파야돼
		//////////////////////////////
		
		try {
			int roomId = doodleService.createRoom(createRoomDto);
			if (roomId == -1) resultMap.put("message", ALREADY_EXIST);
			else {
				resultMap.put("message", SUCCESS);
				resultMap.put("roomId", roomId);
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("방 생성 실패 : {}", e);
			resultMap.put("message", FAIL);
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		
		return new ResponseEntity<>(resultMap, status);
		
	}
	
	@ApiOperation(value = "방 전체 조회", notes = "방 전체 조회 API", response = Map.class)
	@GetMapping("/room")
	public ResponseEntity<?> getAllRooms() {
		
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.OK;
		
		try {
			List<RoomDto> roomDtoList = doodleService.getAllRooms();
			resultMap.put("message", SUCCESS);
			resultMap.put("roomList", roomDtoList);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("방 전체 조회 실패 : {}", e);
			resultMap.put("message", FAIL);
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		
		return new ResponseEntity<>(resultMap, status);
		
	}
	
	@ApiOperation(value = "방 검색", notes = "방 검색 API", response = Map.class)
	@GetMapping("/room/{type}/{keyword}")
	public ResponseEntity<?> searchRooms(
			@PathVariable @ApiParam(value = "검색어 타입") String type,
			@PathVariable @ApiParam(value = "검색어") String keyword) {
		
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.OK;
		
		try {
			List<RoomDto> roomDtoList = doodleService.searchRooms(type, keyword);
			resultMap.put("message", SUCCESS);
			resultMap.put("roomList", roomDtoList);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("방 검색 실패 : {}", e);
			resultMap.put("message", FAIL);
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		
		return new ResponseEntity<>(resultMap, status);
		
	}
	
	@ApiOperation(value = "방 삭제", notes = "방 삭제 API", response = Map.class)
	@DeleteMapping("/room/{roomId}")
	public ResponseEntity<?> deleteRoom(
			@PathVariable @ApiParam(value = "검색어 타입") int roomId) {
		
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.OK;
		
		try {
			doodleService.deleteRoom(roomId);
			resultMap.put("message", SUCCESS);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("방 삭제 실패 : {}", e);
			resultMap.put("message", FAIL);
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		
		return new ResponseEntity<>(resultMap, status);
		
	}
	
	@ApiOperation(value = "방 모드 변경", notes = "방 모드 변경 API", response = Map.class)
	@PutMapping("/room/{roomId}/{mode}")
	public ResponseEntity<?> modifyMode(
			@PathVariable @ApiParam(value = "방 번호") int roomId,
			@PathVariable @ApiParam(value = "모드") int mode) {
		
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.OK;
		
		try {
			int changedMode = doodleService.modifyMode(roomId, mode);
			resultMap.put("message", SUCCESS);
			resultMap.put("changedMode", changedMode);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("방 모드 변경 실패 : {}", e);
			resultMap.put("message", FAIL);
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		
		return new ResponseEntity<>(resultMap, status);
		
	}
	
	@ApiOperation(value = "게임 시작", notes = "게임 시작 API", response = Map.class)
	@PutMapping("/room/start/{roomId}")
	public ResponseEntity<?> start(
			@PathVariable @ApiParam(value = "방 번호") int roomId) {
		
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.OK;
		
		try {
			int started = doodleService.start(roomId);
			resultMap.put("message", SUCCESS);
			resultMap.put("started", started);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("게임 시작 실패 : {}", e);
			resultMap.put("message", FAIL);
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		
		return new ResponseEntity<>(resultMap, status);
		
	}
	
}
